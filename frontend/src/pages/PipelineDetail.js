import { getPipeline, deletePipeline } from '../services/api.js';
import { getEvents, createEvent } from '../services/api.js';

export default {
    template: `
        <div class="container mt-4">
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>{{ pipeline.pipeline_name }}</h2>
                    <div>
                        <router-link :to="'/pipelines/' + pipeline.id + '/edit'" class="btn btn-secondary me-2">
                            Edit
                        </router-link>
                        <button @click="confirmDelete" class="btn btn-danger">Delete</button>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-8">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Pipeline Details</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <span class="badge float-end" :class="getStatusClass(pipeline.status)">
                                        {{ pipeline.status || 'New' }}
                                    </span>
                                    <h6>Status</h6>
                                </div>
                                <div class="mb-3">
                                    <h6>Description</h6>
                                    <p>{{ pipeline.description || 'No description' }}</p>
                                </div>
                                <div class="mb-3">
                                    <h6>Created</h6>
                                    <p>{{ formatDate(pipeline.created_at) }}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Events</h5>
                                <router-link :to="'/pipelines/' + pipeline.id + '/events/new'" class="btn btn-sm btn-primary">
                                    Add Event
                                </router-link>
                            </div>
                            <div class="card-body">
                                <div v-if="eventsLoading" class="text-center">
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                <div v-else-if="events.length === 0" class="text-center">
                                    <p>No events recorded yet.</p>
                                </div>
                                <div v-else class="event-list">
                                    <div v-for="event in events" :key="event.id" class="card mb-2">
                                        <div class="card-body py-2">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span class="badge me-2" :class="getEventTypeClass(event.event_type)">
                                                        {{ formatEventType(event.event_type) }}
                                                    </span>
                                                    <small class="text-muted">{{ formatDateTime(event.timestamp) }}</small>
                                                </div>
                                            </div>
                                            <p class="mb-0 mt-2" v-if="event.note">{{ event.note }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Quick Actions</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <button @click="showQuickEventModal('phone_out')" class="btn btn-outline-primary">
                                        Log Phone Call
                                    </button>
                                    <button @click="showQuickEventModal('email_out')" class="btn btn-outline-primary">
                                        Log Email
                                    </button>
                                    <button @click="showQuickEventModal('meeting_in')" class="btn btn-outline-primary">
                                        Log Meeting
                                    </button>
                                    <button @click="showStatusChangeModal" class="btn btn-outline-primary">
                                        Change Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Event Modal -->
                <div v-if="showEventModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">{{ getEventModalTitle() }}</h5>
                                <button type="button" class="btn-close" @click="closeEventModal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="eventNote" class="form-label">Notes</label>
                                    <textarea class="form-control" id="eventNote" v-model="newEvent.note" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeEventModal">Cancel</button>
                                <button type="button" class="btn btn-primary" @click="saveQuickEvent" :disabled="eventSaving">
                                    {{ eventSaving ? 'Saving...' : 'Save' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Status Change Modal -->
                <div v-if="showStatusModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Change Pipeline Status</h5>
                                <button type="button" class="btn-close" @click="closeStatusModal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="pipelineStatus" class="form-label">Status</label>
                                    <select class="form-select" id="pipelineStatus" v-model="newStatus">
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="statusNote" class="form-label">Notes</label>
                                    <textarea class="form-control" id="statusNote" v-model="statusNote" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeStatusModal">Cancel</button>
                                <button type="button" class="btn btn-primary" @click="saveStatusChange" :disabled="statusSaving">
                                    {{ statusSaving ? 'Saving...' : 'Save' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Delete Confirmation Modal -->
                <div v-if="showDeleteModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirm Delete</h5>
                                <button type="button" class="btn-close" @click="closeDeleteModal"></button>
                            </div>
                            <div class="modal-body">
                                <p>Are you sure you want to delete this pipeline? This action cannot be undone.</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Cancel</button>
                                <button type="button" class="btn btn-danger" @click="deletePipeline" :disabled="deleteLoading">
                                    {{ deleteLoading ? 'Deleting...' : 'Delete' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            pipeline: {},
            events: [],
            loading: true,
            eventsLoading: true,
            showEventModal: false,
            showStatusModal: false,
            showDeleteModal: false,
            newEvent: {
                event_type: null,
                note: ''
            },
            newStatus: '',
            statusNote: '',
            eventSaving: false,
            statusSaving: false,
            deleteLoading: false
        };
    },
    async created() {
        const pipelineId = this.$route.params.id;
        try {
            this.pipeline = await getPipeline(pipelineId);
            this.newStatus = this.pipeline.status || 'New';
            this.loadEvents(pipelineId);
        } catch (error) {
            console.error('Error fetching pipeline:', error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async loadEvents(pipelineId) {
            this.eventsLoading = true;
            try {
                this.events = await getEvents({ pipeline_id: pipelineId });
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                this.eventsLoading = false;
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        },
        formatDateTime(dateString) {
            const date = new Date(dateString);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        },
        getStatusClass(status) {
            switch (status) {
                case 'New': return 'bg-primary';
                case 'In Progress': return 'bg-info';
                case 'On Hold': return 'bg-warning';
                case 'Completed': return 'bg-success';
                case 'Closed': return 'bg-secondary';
                default: return 'bg-primary';
            }
        },
        getEventTypeClass(type) {
            switch (type) {
                case 'phone_in': return 'bg-success';
                case 'phone_out': return 'bg-info';
                case 'email_in': return 'bg-success';
                case 'email_out': return 'bg-info';
                case 'meeting_in': return 'bg-success';
                case 'meeting_out': return 'bg-info';
                case 'status_change': return 'bg-warning';
                default: return 'bg-secondary';
            }
        },
        formatEventType(type) {
            switch (type) {
                case 'phone_in': return 'Phone In';
                case 'phone_out': return 'Phone Out';
                case 'email_in': return 'Email In';
                case 'email_out': return 'Email Out';
                case 'meeting_in': return 'Meeting In';
                case 'meeting_out': return 'Meeting Out';
                case 'status_change': return 'Status Change';
                default: return type;
            }
        },
        showQuickEventModal(eventType) {
            this.newEvent = {
                event_type: eventType,
                note: ''
            };
            this.showEventModal = true;
        },
        closeEventModal() {
            this.showEventModal = false;
        },
        getEventModalTitle() {
            switch (this.newEvent.event_type) {
                case 'phone_in': return 'Log Incoming Call';
                case 'phone_out': return 'Log Outgoing Call';
                case 'email_in': return 'Log Incoming Email';
                case 'email_out': return 'Log Outgoing Email';
                case 'meeting_in': return 'Log Meeting';
                case 'meeting_out': return 'Log External Meeting';
                default: return 'Log Event';
            }
        },
        async saveQuickEvent() {
            this.eventSaving = true;
            try {
                const eventData = {
                    pipeline_id: this.pipeline.id,
                    event_type: this.newEvent.event_type,
                    note: this.newEvent.note
                };
                await createEvent(eventData);
                this.closeEventModal();
                this.loadEvents(this.pipeline.id);
            } catch (error) {
                console.error('Error saving event:', error);
            } finally {
                this.eventSaving = false;
            }
        },
        showStatusChangeModal() {
            this.newStatus = this.pipeline.status || 'New';
            this.statusNote = '';
            this.showStatusModal = true;
        },
        closeStatusModal() {
            this.showStatusModal = false;
        },
        async saveStatusChange() {
            this.statusSaving = true;
            try {
                await updatePipeline(this.pipeline.id, { status: this.newStatus });
                
                const eventData = {
                    pipeline_id: this.pipeline.id,
                    event_type: 'status_change',
                    note: `Status changed to ${this.newStatus}${this.statusNote ? ': ' + this.statusNote : ''}`
                };
                await createEvent(eventData);
                
                this.pipeline.status = this.newStatus;
                this.closeStatusModal();
                this.loadEvents(this.pipeline.id);
            } catch (error) {
                console.error('Error updating status:', error);
            } finally {
                this.statusSaving = false;
            }
        },
        confirmDelete() {
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
        },
        async deletePipeline() {
            this.deleteLoading = true;
            try {
                await deletePipeline(this.pipeline.id);
                this.$router.push('/pipelines');
            } catch (error) {
                console.error('Error deleting pipeline:', error);
            } finally {
                this.deleteLoading = false;
            }
        }
    }
};
