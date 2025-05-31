# src/core/views.py
from django.http import HttpResponse
import hmac
import hashlib
import os
import json
import logging
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings

logger = logging.getLogger(__name__)

def home_view(request):
    html_content = """
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>API Home - Modern Interface</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #151520;
            --bg-tertiary: #1a1a2e;
            --accent-primary: #00d4ff;
            --accent-secondary: #7c3aed;
            --accent-gradient: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
            --text-primary: #ffffff;
            --text-secondary: #a1a1aa;
            --text-muted: #71717a;
            --border-color: #27272a;
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --shadow-glow: 0 0 50px rgba(0, 212, 255, 0.15);
            --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            overflow-x: hidden;
            line-height: 1.6;
        }
        
        /* Animated background */
        .hero-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: -2;
            background: radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 90%, rgba(124, 58, 237, 0.2) 0%, transparent 50%);
        }
        
        .hero-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent 40%, rgba(0, 212, 255, 0.03) 50%, transparent 60%);
            animation: shimmer 8s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
        }
        
        /* Navigation */
        .navbar {
            background: rgba(10, 10, 15, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
        }
        
        /* Hero Section */
        .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            position: relative;
            padding: 8rem 0 4rem;
        }
        
        .hero-content {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .hero-title {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.1;
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 3rem;
            font-weight: 400;
        }
        
        /* Buttons */
        .btn-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .api-btn {
            position: relative;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            backdrop-filter: blur(10px);
            font-size: 0.95rem;
        }
        
        .api-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
        }
        
        .api-btn:hover::before {
            left: 100%;
        }
        
        .api-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-glow);
        }
        
        .btn-primary {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
        }
        
        .btn-primary:hover {
            background: rgba(0, 212, 255, 0.1);
            border-color: var(--accent-primary);
            color: var(--text-primary);
        }
        
        /* Feature Cards */
        .features-section {
            padding: 8rem 0;
            position: relative;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .section-subtitle {
            text-align: center;
            color: var(--text-secondary);
            font-size: 1.125rem;
            margin-bottom: 4rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .feature-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2.5rem;
            height: 100%;
            backdrop-filter: blur(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: var(--accent-gradient);
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }
        
        .feature-card:hover::before {
            transform: scaleX(1);
        }
        
        .feature-card:hover {
            transform: translateY(-8px);
            border-color: rgba(0, 212, 255, 0.3);
            box-shadow: var(--shadow-card), var(--shadow-glow);
        }
        
        .feature-icon {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            position: relative;
            overflow: hidden;
        }
        
        .feature-icon.rocket {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        }
        
        .feature-icon.shield {
            background: linear-gradient(135deg, #00d4ff, #0984e3);
        }
        
        .feature-icon.code {
            background: linear-gradient(135deg, #a29bfe, #6c5ce7);
        }
        
        .feature-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .feature-description {
            color: var(--text-secondary);
            line-height: 1.6;
        }
        
        /* Stats Section */
        .stats-section {
            padding: 6rem 0;
            background: var(--bg-secondary);
            border-radius: 40px;
            margin: 4rem 0;
            position: relative;
            overflow: hidden;
        }
        
        .stats-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--accent-gradient);
        }
        
        .stat-item {
            text-align: center;
            padding: 2rem;
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: 800;
            color: var(--accent-primary);
            font-family: 'JetBrains Mono', monospace;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: var(--text-secondary);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.875rem;
        }
        
        /* Footer */
        .footer {
            padding: 4rem 0 2rem;
            border-top: 1px solid var(--border-color);
            text-align: center;
            color: var(--text-muted);
        }
        
        .footer-content {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-link {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-link:hover {
            color: var(--accent-primary);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-subtitle {
                font-size: 1.125rem;
            }
            
            .btn-grid {
                grid-template-columns: 1fr;
                max-width: 400px;
            }
            
            .section-title {
                font-size: 2rem;
            }
            
            .feature-card {
                padding: 2rem;
            }
            
            .stat-number {
                font-size: 2rem;
            }
            
            .footer-content {
                flex-direction: column;
                gap: 1rem;
            }
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--accent-primary);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #00b8e6;
        }
        
        /* Loading Animation */
        .loading-dots {
            display: inline-flex;
            gap: 4px;
        }
        
        .loading-dots span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent-primary);
            animation: pulse 1.4s ease-in-out infinite both;
        }
        
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes pulse {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    </style>
</head>
<body>
    <div class="hero-bg"></div>
    
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <div class="hero-badge">
                    <i class="fas fa-rocket"></i>
                    <span>API v2.0 Ready</span>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <h1 class="hero-title">Welcome to the Future of APIs</h1>
                <p class="hero-subtitle">
                    Experience next-generation API architecture with cutting-edge performance, 
                    enterprise-grade security, and developer-first design.
                </p>
                
                <div class="btn-grid">
                    <a href="/api/schema/swagger-ui/" class="api-btn btn-primary">
                        <i class="fas fa-book"></i>
                        Swagger Docs
                    </a>
                    <a href="/api/schema/redoc/" class="api-btn btn-primary">
                        <i class="fas fa-file-alt"></i>
                        Redoc Docs
                    </a>
                    <a href="/api" class="api-btn btn-primary">
                        <i class="fas fa-server"></i>
                        API Explorer
                    </a>
                    <a href="/api/token/" class="api-btn btn-primary">
                        <i class="fas fa-key"></i>
                        Authentication
                    </a>
                    <a href="/metrics" class="api-btn btn-primary">
                        <i class="fas fa-chart-line"></i>
                        Analytics
                    </a>
                    <a href="/admin" class="api-btn btn-primary">
                        <i class="fas fa-cog"></i>
                        Admin Panel
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <div class="container">
        <div class="stats-section">
            <div class="row">
                <div class="col-md-4">
                    <div class="stat-item">
                        <div class="stat-number">99.9%</div>
                        <div class="stat-label">Uptime</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-item">
                        <div class="stat-number">&lt;10ms</div>
                        <div class="stat-label">Response Time</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-item">
                        <div class="stat-number">24/7</div>
                        <div class="stat-label">Support</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <h2 class="section-title">Built for Developers</h2>
            <p class="section-subtitle">
                Modern architecture meets developer experience. Every endpoint crafted for performance and ease of use.
            </p>
            
            <div class="row g-4">
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon rocket">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <h3 class="feature-title">Lightning Fast</h3>
                        <p class="feature-description">
                            Optimized with advanced caching, CDN integration, and efficient database queries 
                            to deliver sub-10ms response times consistently.
                        </p>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon shield">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3 class="feature-title">Enterprise Security</h3>
                        <p class="feature-description">
                            Multi-layer security with OAuth 2.0, JWT tokens, rate limiting, 
                            and comprehensive audit logging to protect your data.
                        </p>
                    </div>
                </div>
                
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card">
                        <div class="feature-icon code">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3 class="feature-title">Developer Experience</h3>
                        <p class="feature-description">
                            Interactive documentation, SDK generation, comprehensive examples, 
                            and real-time testing tools for seamless integration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <a href="#" class="footer-link">Documentation</a>
                <a href="#" class="footer-link">Status</a>
                <a href="#" class="footer-link">Support</a>
                <a href="#" class="footer-link">GitHub</a>
            </div>
            <p>&copy; 2025 API Service. Built with ❤️ for developers.</p>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Add smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add parallax effect to hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroBg = document.querySelector('.hero-bg');
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        });

        // Add intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    </script>
</body>
</html>
    """
    return HttpResponse(html_content)

# @csrf_exempt
# @require_POST
# def lemonsqueezy_webhook(request):
#     """
#     Simple function-based view to handle Lemon Squeezy webhooks.
#     Using a function-based view avoids potential issues with class-based views and CSRF.
#     """
#     try:
#         # Get webhook secret from environment or settings
#         secret = os.getenv("WEBHOOK_SECRET") or getattr(settings, "LEMONSQUEEZY_WEBHOOK_SECRET", None)
#         if not secret:
#             logger.error("Webhook secret not configured")
#             return JsonResponse({"error": "Configuration error"}, status=500)
        
#         # Get signature from headers
#         signature = request.headers.get("X-Signature")
#         if not signature:
#             logger.warning("Missing signature in webhook request")
#             return JsonResponse({"error": "Missing signature"}, status=400)
        
#         # Get raw body
#         raw_body = request.body
#         if not raw_body:
#             logger.warning("Empty request body")
#             return JsonResponse({"error": "Empty request body"}, status=400)
        
#         # Compute HMAC
#         computed_signature = hmac.new(
#             key=secret.encode(),
#             msg=raw_body,
#             digestmod=hashlib.sha256
#         ).hexdigest()
        
#         # Verify signature
#         if not hmac.compare_digest(computed_signature, signature):
#             logger.warning(f"Invalid webhook signature received: {signature[:10]}...")
#             return JsonResponse({"error": "Invalid signature"}, status=401)
        
#         # Process webhook data
#         try:
#             payload = json.loads(raw_body)
#             event_name = payload.get("meta", {}).get("event_name")
#             test_mode = payload.get("meta", {}).get("test_mode", False)
            
#             # Log the event for debugging
#             logger.info(f"Received Lemon Squeezy webhook: {event_name} (test_mode: {test_mode})")
            
#             # Handle different event types
#             if event_name == "order_created":
#                 order = payload["data"]
#                 customer_email = order["attributes"]["user_email"]
#                 product_name = order["attributes"]["first_order_item"]["product_name"]
#                 amount = float(order["attributes"]["total"]) / 100
                
#                 logger.info(f"New order: {product_name} for ${amount} from {customer_email}")
                
#                 # TODO: Add your business logic here
#                 # e.g., fulfill order, send confirmation email, update database
                
#             elif event_name == "order_refunded":
#                 # Handle refund logic
#                 logger.info("Order refunded event")
#                 # TODO: Process refund logic
                
#             elif event_name == "subscription_created":
#                 # Handle new subscription
#                 logger.info("New subscription created")
#                 # TODO: Process subscription creation
                
#             elif event_name == "subscription_updated":
#                 # Handle subscription updates
#                 logger.info("Subscription updated")
#                 # TODO: Process subscription update
                
#             else:
#                 logger.info(f"Other webhook event: {event_name}")
            
#             return JsonResponse({"status": "success"}, status=200)
            
#         except json.JSONDecodeError:
#             logger.error("Failed to parse webhook JSON")
#             return JsonResponse({"error": "Invalid JSON"}, status=400)
            
#     except Exception as e:
#         logger.exception(f"Webhook processing error: {str(e)}")
#         return JsonResponse({"error": "Server error"}, status=500)