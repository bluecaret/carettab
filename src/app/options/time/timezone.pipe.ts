import { Injectable, PipeTransform, Pipe } from '@angular/core';
import { TimezoneService } from './timezone.service';

/**
 * Transforms any input value
 */
@Pipe({
  name: 'iso2CountryPipe'
})
@Injectable()
export class TimezonePipe implements PipeTransform {
  constructor(private tz: TimezoneService) {}
  transform(value: string): string {
    return this.tz.iso2country(value);
  }
}
