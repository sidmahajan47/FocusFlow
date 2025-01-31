class ParticleEffect {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.particles = [];
		this.isEnabled = localStorage.getItem('particlesEnabled') !== 'false';
		this.isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
		
		this.init();
		this.createParticles();
		this.animate();
		this.handleResize();
		this.setupThemeListener();
	}

	init() {
		this.canvas.id = 'particles-canvas';
		this.canvas.style.position = 'fixed';
		this.canvas.style.top = '0';
		this.canvas.style.left = '0';
		this.canvas.style.width = '100%';
		this.canvas.style.height = '100%';
		this.canvas.style.pointerEvents = 'none';
		this.canvas.style.zIndex = '0';
		document.body.prepend(this.canvas);
	}

	createParticles() {
		const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
		this.particles = [];

		for (let i = 0; i < particleCount; i++) {
			this.particles.push({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				size: Math.random() * 3 + 1,
				speedX: Math.random() * 0.5 - 0.25,
				speedY: Math.random() * 0.5 - 0.25,
				opacity: Math.random() * 0.5 + 0.1
			});
		}
	}

	handleResize() {
		window.addEventListener('resize', () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.createParticles();
		});
		
		// Initial resize
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	setupThemeListener() {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					this.isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
	}

	toggleParticles(enabled) {
		this.isEnabled = enabled;
		localStorage.setItem('particlesEnabled', enabled);
		this.canvas.style.display = enabled ? 'block' : 'none';
	}

	animate() {
		if (!this.isEnabled) {
			requestAnimationFrame(() => this.animate());
			return;
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		const particleColor = this.isDarkTheme ? '255, 255, 255' : '0, 0, 0';

		this.particles.forEach(particle => {
			particle.x += particle.speedX;
			particle.y += particle.speedY;

			if (particle.x < 0) particle.x = this.canvas.width;
			if (particle.x > this.canvas.width) particle.x = 0;
			if (particle.y < 0) particle.y = this.canvas.height;
			if (particle.y > this.canvas.height) particle.y = 0;

			this.ctx.beginPath();
			this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			this.ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
			this.ctx.fill();
		});

		requestAnimationFrame(() => this.animate());
	}
}

// Initialize particles
const particleEffect = new ParticleEffect();

// Export for global access
window.particleEffect = particleEffect;