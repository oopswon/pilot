import { login } from '../services/api.js';
import { setAuth } from '../utils/auth.js';

export default {
    template: `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            <h4 class="mb-0">Login</h4>
                        </div>
                        <div class="card-body">
                            <div v-if="error" class="alert alert-danger">{{ error }}</div>
                            <form @submit.prevent="handleLogin">
                                <div class="mb-3">
                                    <label for="username" class="form-label">Username</label>
                                    <input type="text" class="form-control" id="username" v-model="username" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="password" v-model="password" required>
                                </div>
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-primary" :disabled="loading">
                                        {{ loading ? 'Logging in...' : 'Login' }}
                                    </button>
                                </div>
                            </form>
                            <div class="mt-3 text-center">
                                <p>Don't have an account? <router-link to="/register">Register</router-link></p>
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
            loading: false,
            error: null
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await login(this.username, this.password);
                
                setAuth(response.access_token, { username: this.username });
                
                this.$router.push('/dashboard');
            } catch (error) {
                this.error = 'Invalid username or password. Please try again.';
                console.error('Login error:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
