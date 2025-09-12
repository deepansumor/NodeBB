<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
       
    }

    .thank-you-container {
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03);
        padding: 48px 40px;
        text-align: center;
        max-width: 480px;
        width: 100vw;
    }

    .checkmark-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 24px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: scaleIn 0.5s ease-out;
    }

    .checkmark-icon::after {
        content: '✓';
        color: white;
        font-size: 32px;
        font-weight: bold;
    }



    @keyframes scaleIn {
        0% {
            transform: scale(0);
            opacity: 0;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .main-heading {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 16px;
        letter-spacing: -0.025em;
    }

    .subtext {
        font-size: 1.125rem;
        color: #6b7280;
        margin-bottom: 32px;
        line-height: 1.6;
    }

    .home-button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px 32px;
        font-size: 1rem;
        font-weight: 500;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;
    }

    .home-button:hover {
        background: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .home-button:active {
        transform: translateY(0);
    }

    @media (max-width: 640px) {
        .thank-you-container {
            padding: 32px 24px;
        }

        .main-heading {
            font-size: 2rem;
        }

        .subtext {
            font-size: 1rem;
        }
    }
</style>

<div class="container">

    <div class="thank-you-container">
        <div class="checkmark-icon"></div>
        <h1 class="main-heading">Thank You!</h1>
        <p class="subtext">Your registration with amazon has been successfull.</p>
        <a href="https://escape-velocity.com/" class="home-button">Go Back Home</a>
    </div>
</div>