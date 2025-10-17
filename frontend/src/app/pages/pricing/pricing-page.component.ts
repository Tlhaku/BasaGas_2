import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PricingTier {
  size: string;
  price: string;
  description: string;
}

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.scss'
})
export class PricingPageComponent {
  tiers: PricingTier[] = [
    { size: '2 kg Cylinder', price: 'R 70 + R45 delivery', description: 'Ideal for small households and portable stoves.' },
    { size: '3 kg Cylinder', price: 'R 104 + R45 delivery', description: 'Perfect for backup heating or compact apartments.' },
    { size: '5 kg Cylinder', price: 'R 184 + R45 delivery', description: 'The preferred size for regular home cooking.' },
    { size: '7 kg Cylinder', price: 'R 250 + R45 delivery', description: 'Best value for families and extended use.' }
  ];
}
