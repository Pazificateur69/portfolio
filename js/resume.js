document.addEventListener('DOMContentLoaded', () => {

    // --- Radar Chart Initialization ---
    const ctx = document.getElementById('skillsRadarChart');

    if (ctx) {
        const data = {
            labels: [
                'Frontend',
                'Backend',
                'Sécurité',
                'Web3/DeFi',
                'DevOps',
                'Architecture'
            ],
            datasets: [{
                label: 'Niveau d\'Expertise',
                data: [90, 85, 80, 75, 75, 85],
                fill: true,
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderColor: 'rgba(6, 182, 212, 1)',
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
            }]
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: 'rgba(241, 245, 249, 0.8)',
                            font: {
                                family: "'JetBrains Mono', monospace",
                                size: 11
                            }
                        },
                        ticks: {
                            display: false,
                            min: 0,
                            max: 100,
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(5, 5, 8, 0.9)',
                        titleColor: '#fff',
                        bodyColor: 'rgba(6, 182, 212, 1)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return context.parsed.r + '%';
                            }
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);
    }

    // --- Animation of Progress Bars on Scroll ---
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.prog-bar');
                bars.forEach(bar => {
                    // The width is controlled by CSS classes attached to it (p-95, p-80, etc)
                    // We just need to trigger a reflow and add a class that sets the width from 0 to target
                    const targetWidth = bar.className.match(/p-(\d+)/);
                    if (targetWidth && targetWidth[1]) {
                        bar.style.width = targetWidth[1] + '%';
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const widgets = document.querySelectorAll('.cv-widget');
    widgets.forEach(widget => {
        progressObserver.observe(widget);
    });

});
