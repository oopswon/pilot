export default {
    template: `
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark" v-if="isAuthenticated">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">CRM Pipeline Tracker</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/pipelines">Pipelines</router-link>
                            </li>
                        </ul>
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="container-fluid">
                <router-view></router-view>
            </div>
        </div>
    `,
    data() {
        return {
            isAuthenticated: false
        };
    },
    created() {
        this.isAuthenticated = !!localStorage.getItem('token');
        this.$watch(
            () => this.$route.path,
            () => {
                this.isAuthenticated = !!localStorage.getItem('token');
            }
        );
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.isAuthenticated = false;
            this.$router.push('/login');
        }
    }
};
