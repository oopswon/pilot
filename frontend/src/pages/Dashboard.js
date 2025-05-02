import { getPipelines } from '../services/api.js';
import { getCurrentUser } from '../utils/auth.js';

export default {
    template: `
        <div class="container mt-4">
            <h2>Dashboard</h2>
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Active Pipelines</h5>
                            <h1 class="display-4">{{ activePipelines.length }}</h1>
                            <router-link to="/pipelines" class="btn btn-primary">View All</router-link>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Recent Events</h5>
                            <h1 class="display-4">{{ recentEvents }}</h1>
                            <button class="btn btn-primary" disabled>View All</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">My Department</h5>
                            <h1 class="display-4">{{ departmentPipelines.length }}</h1>
                            <button class="btn btn-primary" disabled>View All</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Recent Pipelines</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="loading" class="text-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            <div v-else-if="pipelines.length === 0" class="text-center">
                                <p>No pipelines found.</p>
                                <router-link to="/pipelines/new" class="btn btn-primary">Create Pipeline</router-link>
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="pipeline in pipelines.slice(0, 5)" :key="pipeline.id">
                                            <td>{{ pipeline.pipeline_name }}</td>
                                            <td>
                                                <span class="badge" :class="getStatusClass(pipeline.status)">
                                                    {{ pipeline.status || 'New' }}
                                                </span>
                                            </td>
                                            <td>{{ formatDate(pipeline.created_at) }}</td>
                                            <td>
                                                <router-link :to="'/pipelines/' + pipeline.id" class="btn btn-sm btn-info">
                                                    View
                                                </router-link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="text-end">
                                    <router-link to="/pipelines" class="btn btn-primary">View All Pipelines</router-link>
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
            recentEvents: 0,
            user: getCurrentUser()
        };
    },
    computed: {
        activePipelines() {
            return this.pipelines.filter(p => p.status !== 'Closed' && p.status !== 'Completed');
        },
        departmentPipelines() {
            return this.pipelines.filter(p => p.department_id === this.user?.department_id);
        }
    },
    async created() {
        try {
            this.pipelines = await getPipelines();
            this.recentEvents = Math.floor(Math.random() * 10); // Mock data for demo
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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
        }
    }
};
