import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Gidugangan og CommonModule
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel'; // 1. I-import ang CarouselModule

@Component({
    selector: 'app-landing-page',
    standalone: true,
    // 2. I-add ang CarouselModule ug CommonModule sa imports
    imports: [
        CommonModule,
        MenubarModule,
        ButtonModule,
        RouterModule,
        CarouselModule
    ],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, AfterViewInit {
    items: MenuItem[] | undefined;

    // 3. Array para sa imong Happy Pets Slideshow
    images: any[] = [];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        // 4. I-define ang mga images nga i-autoplay
        this.images = [
            {
                url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop',
                alt: 'Happy Husky'
            },
            {
                url: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=1000&auto=format&fit=crop',
                alt: 'Female vet checking a cat'
            },
            {
                url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1000&auto=format&fit=crop',
                alt: 'Puppy running on grass'
            },
            {
                url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1000&auto=format&fit=crop',
                alt: 'Smiling Golden Retriever'
            },
            {
                url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
                alt: 'Playful Cat'
            },
            {
                url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?q=80&w=1000&auto=format&fit=crop',
                alt: 'Dog getting a bubble bath'
            },
            {
                url: 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1000&auto=format&fit=crop',
                alt: 'Groomer brushing a fluffy dog'
            },
            {
                url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop',
                alt: 'Happy Dog and Cat'
            }
        ];

        this.items = [
            { label: 'Home', icon: 'pi pi-home', command: () => this.scrollTo('home') },
            { label: 'Services', icon: 'pi pi-heart', command: () => this.scrollTo('services') },
            { label: 'Contact', icon: 'pi pi-envelope', command: () => this.scrollTo('footer') }
        ];
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            const observerOptions = {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach((el) => observer.observe(el));
        }
    }

    scrollTo(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}