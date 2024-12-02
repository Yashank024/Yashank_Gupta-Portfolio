// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#bg'),
        antialias: true,
        alpha: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Responsive canvas
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Camera position
    camera.position.z = 30;

    // Create stars
    const stars = [];
    const starGeometry = new THREE.SphereGeometry(0.1, 24, 24);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    function addStar() {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        star.position.set(x, y, z);
        
        // Add custom properties for animation
        star.userData = {
            originalScale: Math.random() * 0.5 + 0.5,
            pulseSpeed: Math.random() * 0.005 + 0.002,
            twinklePhase: Math.random() * Math.PI * 2
        };
        
        stars.push(star);
        scene.add(star);
    }

    // Add more stars for a denser field
    Array(500).fill().forEach(addStar);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point lights for better star illumination
    const pointLight1 = new THREE.PointLight(0x4cc9f0, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7b2cbf, 2);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Custom cursor
    const cursor = {
        dot: document.querySelector('.cursor-dot'),
        outline: document.querySelector('.cursor-outline')
    };

    document.addEventListener('mousemove', (e) => {
        cursor.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursor.outline.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    });

    // Hover effects for links and buttons
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.outline.style.border = '2px solid rgba(255,255,255,1)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.outline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.outline.style.border = '2px solid rgba(255,255,255,0.5)';
        });
    });

    // Create geometric shapes with modern materials
    function addSphere() {
        const geometry = new THREE.IcosahedronGeometry(Math.random() * 2 + 1, 0);
        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0x7b2cbf),
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.25,
            transmission: 0.5,
            thickness: 0.5,
            envMapIntensity: 1
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        sphere.position.set(x, y, z);
        
        // Add rotation animation
        sphere.userData = {
            rotationSpeed: {
                x: Math.random() * 0.02 - 0.01,
                y: Math.random() * 0.02 - 0.01,
                z: Math.random() * 0.02 - 0.01
            }
        };
        
        scene.add(sphere);
        return sphere;
    }

    // Add multiple spheres
    const spheres = Array(15).fill().map(addSphere);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Animate stars
        stars.forEach(star => {
            const time = Date.now() * star.userData.pulseSpeed;
            
            // Pulsing effect
            const scale = star.userData.originalScale * (1 + Math.sin(time + star.userData.twinklePhase) * 0.3);
            star.scale.set(scale, scale, scale);
            
            // Subtle rotation
            star.rotation.x += 0.001;
            star.rotation.y += 0.001;
        });

        // Gentle camera movement
        camera.position.x = Math.sin(Date.now() * 0.0001) * 0.5;
        camera.position.y = Math.cos(Date.now() * 0.0001) * 0.5;
        
        // Parallax effect on scroll
        const scrollY = window.scrollY;
        scene.rotation.y = scrollY * 0.0002;
        scene.rotation.x = scrollY * 0.0001;

        // Rotate spheres with unique speeds
        spheres.forEach(sphere => {
            sphere.rotation.x += sphere.userData.rotationSpeed.x;
            sphere.rotation.y += sphere.userData.rotationSpeed.y;
            sphere.rotation.z += sphere.userData.rotationSpeed.z;
            
            // Pulse effect
            const time = Date.now() * 0.001;
            sphere.scale.x = sphere.scale.y = sphere.scale.z = 1 + Math.sin(time) * 0.1;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Split text animation
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(text => {
        const split = new SplitType(text, { types: 'chars' });
        gsap.from(split.chars, {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.05,
            ease: 'back.out'
        });
    });

    // Scroll animations
    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations for sections
    document.querySelectorAll('.section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 100,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1
            }
        });
    });

    // Project card hover effect
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: index % 2 === 0 ? -100 : 100,
            duration: 1,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1
            }
        });
    });

    // Skills animations
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        gsap.from(category, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: category,
                start: 'top 80%'
            }
        });

        // Animate skill items
        const skills = category.querySelectorAll('li');
        skills.forEach((skill, i) => {
            gsap.from(skill, {
                opacity: 0,
                x: -20,
                duration: 0.5,
                delay: index * 0.1 + i * 0.1,
                scrollTrigger: {
                    trigger: category,
                    start: 'top 80%'
                }
            });
        });
    });

    // Profile image animation
    gsap.from('.profile-image', {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        scrollTrigger: {
            trigger: '.profile-image',
            start: 'top 80%'
        }
    });

    // Social links animation
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach((link, index) => {
        gsap.from(link, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: '.social-links',
                start: 'top 80%'
            }
        });
    });

    // Contact info animations
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: item,
                start: 'top 90%'
            }
        });
    });

    // Initialize
    window.addEventListener('load', () => {
        // Hide loading screen with animation
        gsap.to('.loading-screen', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.querySelector('.loading-screen').style.display = 'none';
            }
        });
    });
});
