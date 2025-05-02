import { getPipelines } from '../services/api.js';

export default {
    template: `
        <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Pipelines</h2>
                <router-link to="/pipelines/new" class="btn btn-primary">
                    <i class="bi bi-plus"></i> New Pipeline
                </router-link>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-4">
                            <select class="form-select" v-model="filterStatus">
                                <option value="">All Statuses</option>
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select class="form-select" v-model="filterDepartment">
                                <option value="">All Departments</option>
                                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                    {{ dept.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Search..." v-model="searchQuery">
                                <button class="btn btn-outline-secondary" type="button" @click="searchPipelines">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else-if="filteredPipelines.length === 0" class="text-center">
                        <p>No pipelines found.</p>
                    </div>
                    <div v-else>
                        <div class="row">
                            <div v-for="pipeline in filteredPipelines" :key="pipeline.id" class="col-md-4 mb-4">
                                <div class="card pipeline-card h-100">
                                    <div class="card-header">
                                        <span class="badge float-end" :class="getStatusClass(pipeline.status)">
                                            {{ pipeline.status || 'New' }}
                                        </span>
                                        <h5 class="card-title mb-0">{{ pipeline.pipeline_name }}</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">{{ truncateDescription(pipeline.description) }}</p>
                                        <p class="card-text"><small class="text-muted">Created: {{ formatDate(pipeline.created_at) }}</small></p>
                                    </div>
                                    <div class="card-footer bg-transparent">
                                        <router-link :to="'/pipelines/' + pipeline.id" class="btn btn-sm btn-info me-2">
                                            View
                                        </router-link>
                                        <router-link :to="'/pipelines/' + pipeline.id + '/edit'" class="btn btn-sm btn-secondary">
                                            Edit
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            pipelines: [],
            loading: true,
            filterStatus: '',
            filterDepartment: '',
            searchQuery: '',
            departments: [
                { id: 1, name: 'Sales' },
                { id: 2, name: 'Marketing' },
                { id: 3, name: 'Customer Support' }
            ]
        };
    },
    computed: {
        filteredPipelines() {
            let result = [...this.pipelines];
            
            if (this.filterStatus) {
                result = result.filter(p => p.status === this.filterStatus);
            }
            
            if (this.filterDepartment) {
                result = result.filter(p => p.department_id === parseInt(this.filterDepartment));
            }
            
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p => 
                    p.pipeline_name.toLowerCase().includes(query) || 
                    (p.description && p.description.toLowerCase().includes(query))
                );
            }
            
            return result;
        }
    },
    async created() {
        try {
            this.pipelines = await getPipelines();
        } catch (error) {
            console.error('Error fetching pipelines:', error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString();
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
        truncateDescription(description) {
            if (!description) return 'No description';
            return description.length > 100 ? description.substring(0, 100) + '...' : description;
        },
        searchPipelines() {
        }
    }
};
