import { createPipeline, updatePipeline, getPipeline } from '../services/api.js';

export default {
    template: `
        <div class="container mt-4">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">{{ isEditing ? 'Edit Pipeline' : 'Create New Pipeline' }}</h4>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="error" class="alert alert-danger">{{ error }}</div>
                        <form @submit.prevent="savePipeline" class="form-container">
                            <div class="mb-3">
                                <label for="pipelineName" class="form-label">Pipeline Name *</label>
                                <input type="text" class="form-control" id="pipelineName" v-model="pipeline.pipeline_name" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="description" class="form-label">Description</label>
                                <textarea class="form-control" id="description" v-model="pipeline.description" rows="3"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="department" class="form-label">Department</label>
                                <select class="form-select" id="department" v-model="pipeline.department_id">
                                    <option value="">Select Department</option>
                                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                        {{ dept.name }}
                                    </option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="status" class="form-label">Status</label>
                                <select class="form-select" id="status" v-model="pipeline.status">
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            
                            <div class="d-flex justify-content-between">
                                <router-link to="/pipelines" class="btn btn-secondary">Cancel</router-link>
                                <button type="submit" class="btn btn-primary" :disabled="saving">
                                    {{ saving ? 'Saving...' : 'Save Pipeline' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            pipeline: {
                pipeline_name: '',
                description: '',
                department_id: '',
                status: 'New'
            },
            departments: [
                { id: 1, name: 'Sales' },
                { id: 2, name: 'Marketing' },
                { id: 3, name: 'Customer Support' }
            ],
            loading: false,
            saving: false,
            error: null,
            isEditing: false
        };
    },
    async created() {
        const pipelineId = this.$route.params.id;
        if (pipelineId) {
            this.isEditing = true;
            this.loading = true;
            try {
                this.pipeline = await getPipeline(pipelineId);
            } catch (error) {
                this.error = 'Failed to load pipeline data. Please try again.';
                console.error('Error loading pipeline:', error);
            } finally {
                this.loading = false;
            }
        }
    },
    methods: {
        async savePipeline() {
            this.saving = true;
            this.error = null;
            
            try {
                if (this.isEditing) {
                    await updatePipeline(this.$route.params.id, this.pipeline);
                } else {
                    await createPipeline(this.pipeline);
                }
                
                this.$router.push('/pipelines');
            } catch (error) {
                this.error = 'Failed to save pipeline. Please try again.';
                console.error('Error saving pipeline:', error);
            } finally {
                this.saving = false;
            }
        }
    }
};
