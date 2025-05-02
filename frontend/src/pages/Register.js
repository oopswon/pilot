import { register } from '../services/api.js';

export default {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            <h4 class="mb-0">Register</h4>
                        </div>
                        <div class="card-body">
                            <div v-if="error" class="alert alert-danger">{{ error }}</div>
                            <div v-if="success" class="alert alert-success">{{ success }}</div>
                            <form @submit.prevent="handleRegister">
                                <div class="mb-3">
                                    <label for="username" class="form-label">Username</label>
                                    <input type="text" class="form-control" id="username" v-model="username" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="password" v-model="password" required>
                                </div>
                                <div class="mb-3">
                                    <label for="department" class="form-label">Department</label>
                                    <select class="form-select" id="department" v-model="departmentId">
                                        <option value="">Select Department</option>
                                        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                            {{ dept.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-primary" :disabled="loading">
                                        {{ loading ? 'Registering...' : 'Register' }}
                                    </button>
                                </div>
                            </form>
                            <div class="mt-3 text-center">
                                <p>Already have an account? <router-link to="/login">Login</router-link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            username: '',
            password: '',
            departmentId: '',
            departments: [
                { id: 1, name: 'Sales' },
                { id: 2, name: 'Marketing' },
                { id: 3, name: 'Customer Support' }
            ],
            loading: false,
            error: null,
            success: null
        };
    },
    methods: {
        async handleRegister() {
            this.loading = true;
            this.error = null;
            this.success = null;
            
            try {
                const userData = {
                    username: this.username,
                    password: this.password,
                    department_id: this.departmentId || null
                };
                
                await register(userData);
                
                this.success = 'Registration successful! You can now login.';
                this.username = '';
                this.password = '';
                this.departmentId = '';
                
                setTimeout(() => {
                    this.$router.push('/login');
                }, 2000);
            } catch (error) {
                this.error = 'Registration failed. Please try again.';
                console.error('Registration error:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
