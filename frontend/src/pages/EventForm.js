import { createEvent } from '../services/api.js';

export default {
    template: `
        <div class="container mt-4">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">Add New Event</h4>
                </div>
                <div class="card-body">
                    <div v-if="error" class="alert alert-danger">{{ error }}</div>
                    <form @submit.prevent="saveEvent" class="form-container">
                        <div class="mb-3">
                            <label for="eventType" class="form-label">Event Type *</label>
                            <select class="form-select" id="eventType" v-model="event.event_type" required>
                                <option value="">Select Event Type</option>
                                <option value="phone_in">Phone In</option>
                                <option value="phone_out">Phone Out</option>
                                <option value="email_in">Email In</option>
                                <option value="email_out">Email Out</option>
                                <option value="meeting_in">Meeting In</option>
                                <option value="meeting_out">Meeting Out</option>
                                <option value="status_change">Status Change</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="note" class="form-label">Notes</label>
                            <textarea class="form-control" id="note" v-model="event.note" rows="5"></textarea>
                        </div>
                        
                        <div class="d-flex justify-content-between">
                            <router-link :to="'/pipelines/' + pipelineId" class="btn btn-secondary">Cancel</router-link>
                            <button type="submit" class="btn btn-primary" :disabled="saving">
                                {{ saving ? 'Saving...' : 'Save Event' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            event: {
                event_type: '',
                note: ''
            },
            saving: false,
            error: null
        };
    },
    computed: {
        pipelineId() {
            return this.$route.params.id;
        }
    },
    methods: {
        async saveEvent() {
            this.saving = true;
            this.error = null;
            
            try {
                const eventData = {
                    ...this.event,
                    pipeline_id: parseInt(this.pipelineId)
                };
                
                await createEvent(eventData);
                this.$router.push(`/pipelines/${this.pipelineId}`);
            } catch (error) {
                this.error = 'Failed to save event. Please try again.';
                console.error('Error saving event:', error);
            } finally {
                this.saving = false;
            }
        }
    }
};
