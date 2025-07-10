
   
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
        /* Escape Velocity Theme Colors */
        :root {
            --ev-accent: #f47b4d;
            /*
      Coral/orange accent color */
            --ev-dark: #333333;
            /* Dark text color */
            --ev-light-bg: #f8f9fa;
            /* Light background */
            --ev-blue: #3a4d89;
            /*
      Brand blue */
            --ev-green: #25D366;
            /* WhatsApp green */
        }

        /* Text styling
      */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            color: var(--ev-dark);
        }

        .accent-text {
            color:
                var(--ev-accent);
        }

        /* Button styling */
        .ev-btn {
            border: 1px solid var(--ev-dark);
            border-radius: 25px;
            padding: 8px 20px;
            text-decoration:
                none;
            color: var(--ev-dark);
            transition: all 0.3s ease;
        }

        .ev-btn:hover {
            background-color: var(--ev-dark);
            color: white;
        }

        /* Card styling */
        .card-ev {
            background-color: white;
            border-radius: 8px;
           
        }

        /* Icon styling */
        .icon-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            padding:
                1rem;
            border-radius: 50%;
            height: 70px;
            width: 68px;
            background-color:
                rgba(244, 123, 77, 0.1);
        }

        /* Section styling */
        .section-light {
            background-color: rgba(58, 77, 137, 0.05);
        }

        /* Link styling */
        a {
            color:
                var(--ev-accent);
            text-decoration: none;
        }

        a:hover {
            color:
                var(--ev-blue);
        }

        /* Navigation arrow */
        .nav-arrow {
            color:
                var(--ev-accent);
        }

        .bg-dot{
            position: relative;
            z-index: 10;
        }
        .bg-dot::after{
            content: "";
            bottom: 150px;
            display: block;
            position: absolute;
            margin-bottom: 0;
            height: 70%;
            width: 60%;
            background-image: url('/assets/images/bg-repeat.png') !important;
            background-position: 0 0px !important;
            background-repeat: repeat !important;
            right: 0;
            z-index: -1;
        }

        .text-para{

           font-family: 'Roboto',sans-serif;
        }

                
    </style>

    <!-- HERO SECTION -->
    <section class="py-5 text-center">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 text-start">
                    <h1 class="fw-bold">Centralized Escalation & Alert Management for
                        <span class="accent-text">Amazon Ads</span>
                        Operations
                    </h1>
                    <p class="mt-3 text-muted text-para">
                        An internal platform tailored for Escape Velocity teams to track escalations,
                         respond to alerts, and maintain campaign performance with clarity and control.
                    </p>

                </div>
                <div class="col-lg-6 text-center mt-4 mt-lg-0">
                    <div class="card-ev p-4 bg-dot">
                        <img src="/assets/images/escape.png" alt="Dashboard Screenshot" class="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- QUICK ACCESS -->
    <section class="py-5 section-light">
        <div class="container text-center">
            <h2 class="fw-semibold mb-4">Quick Access</h2>
            <div class="row g-4">
                <div class="col-md-4">
                    <a href="/escalations" class="text-decoration-none text-dark h-100 d-block">
                        <div class="card-ev p-4  h-100">
                             <div class="w-100 rounded-md">
                                <img src="/assets/images/escalation.png"
                                  widht='300px' height='100px' />
                            </div>
                            <h5 class="fw-bold">Escalation Management</h5>
                            <p class="text-muted mb-4">Monitor and manage campaign
                                escalations with real-time tracking and automated alerts.</p>
                            <div class="d-flex justify-content-end mt-auto">
                                <span class="nav-arrow fs-5">→</span>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="col-md-4">
                    <a href="/thresholds" class="text-decoration-none text-dark h-100 d-block">
                        <div class="card-ev p-4  h-100">
                           <div class="w-100">
                                <img src="/assets/images/thresholds.jpeg"
                                  widht='300px' height='100px' />
                                
                            </div>
                            <h5 class="fw-bold">Threshold Monitoring</h5>
                            <p class="text-muted mb-4">Set custom performance thresholds and
                                receive instant notifications when metrics deviate.</p>
                            <div class="d-flex justify-content-end mt-auto">
                                <span class="nav-arrow fs-5">→</span>
                            </div>
                        </div>
                    </a>
                </div>

                <div class="col-md-4">
                    <a href="/admin" class="text-decoration-none text-dark h-100 d-block">
                        <div class="card-ev p-4  h-100">
                            <div class="w-100">
                                <img src="/assets/images/admin.png"
                                  widht='300px' height='100px' />
                                
                            </div>
                            <h5 class="fw-bold">Admin Controls</h5>
                            <p class="text-muted mb-4">Comprehensive admin panel for
                                managing users, roles, and system configurations.</p>
                            <div class="d-flex justify-content-end mt-auto">
                                <span class="nav-arrow fs-5">→</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-5">
        <div class="container text-center">
            <h2 class="fw-semibold mb-4">How It
                <span class="accent-text">Works</span>
            </h2>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card-ev p-4 h-100">
                         <div class="w-100 ">
                                <img src="/assets/images/accountManagement.png"
                                  widht='300px' height='100px' />
                         </div>      
                        <h5 class="fw-bold">1. Account Management</h5>
                        <p class="text-muted">Organize and categorize accounts for
                            efficient management and tracking.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card-ev p-4 h-100">
                            <div class="w-100 ">
                                <img src="/assets/images/issueEscalation.png"
                                  widht='300px' height='100px' />
                            </div>                        
                            <h5 class="fw-bold">2. Issue Escalation</h5>
                            <p class="text-muted">Track escalations through a structured
                            topic-based system.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card-ev p-4 h-100">
                         <div class="w-100">
                                <img src="/assets/images/alert.png"
                                  widht='300px' height='100px' />
                                
                            </div>
                        <h5 class="fw-bold">3. Monitoring & Alerts</h5>
                        <p class="text-muted">Set performance thresholds and receive
                            timely notifications.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

