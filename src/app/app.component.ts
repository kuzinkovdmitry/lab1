import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form!: FormArray;
  headers: any = [];
  steps: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormArray([
      this.getGroup('g1', 1, 2, 30, 40, 50),
      this.getGroup('g2', 1, 2, 30, 40, 50),
      this.getGroup('r', 1, 2)
    ]);
    this.headers = Object.keys(this.form.controls[0].value);
  }

  private getGroup(name: string, p1: number, p2: number, v?: number, a?: number, c?: number): FormGroup {
    return new FormGroup({
      name: new FormControl(name),
      p1: new FormControl(p1),
      p2: new FormControl(p2),
      v: new FormControl(v),
      a: new FormControl(a),
      c: new FormControl(c)
    });
  }

  addRow(): void {
    const group = new FormGroup({
      name: new FormControl(`g${this.form.controls.length}`)
    });
    this.headers.filter((str: string) => str !== 'name').forEach((name: any) => {
      group.addControl(name, new FormControl(0));
    });
    this.form.insert(this.form.controls.length - 1, group);
  }

  removeRow(index: number): void {
    this.form.removeAt(index);
  }

  addColumn(): void {
    const name = `p${this.headers.length - 3}`;
    this.headers.splice(this.headers.length - 3, 0, name);
    this.form.controls.forEach(group => (group as FormGroup).addControl(name, new FormControl(0)));
  }

  removeColumn(name: string): void {
    this.headers = this.headers.filter((header: string) => header !== name);
    this.form.controls.forEach(group => (group as FormGroup).removeControl(name));
  }

  getData(): void {
    const formData = JSON.parse(JSON.stringify(this.form.value));
    const dynamicP = this.headers.filter((header: string) => header !== 'name' && header !== 'v' && header !== 'a' && header !== 'c');
    const request = formData.map((item: any) => {
      item.p = [];
      dynamicP.forEach((p: string) => {
        item.p.push(item[p]);
        delete item[p];
      });
      item.p = item.p.join();
      Object.keys(item).forEach(key => {
        if (item[key] === null) {
          delete item[key];
        }
      });
      return item;
    });
    this.dataService.getData(request).subscribe(data => this.steps = data);
  }

}
