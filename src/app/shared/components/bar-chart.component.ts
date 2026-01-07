import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-bar-chart',
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #canvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      width: 100%;
    }
  `]
})
export class BarChartComponent implements AfterViewInit, OnChanges {

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() title = '';
  @Input() chartType: 'bar' | 'pie' = 'bar';

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.chart) return;

    if (changes['labels']) {
      this.chart.data.labels = this.labels;
    }

    if (changes['data']) {
      this.chart.data.datasets[0].data = this.data;
    }

    this.chart.update();
  }

  private createChart(): void {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: [{
          label: this.title,
          data: this.data,
          backgroundColor:
            this.chartType === 'pie'
              ? ['#3b82f6', '#22c55e', '#f97316', '#ef4444']
              : '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
