import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service';

@Component({
  selector: 'app-lab2',
  templateUrl: './lab2.component.html',
  styleUrls: ['./lab2.component.scss']
})
export class Lab2Component implements OnInit {
  public score = {
    player1: 0,
    player2: 0
  };
  form!: FormArray;
  headers = ['Тип обʼєкту', 'Камінь', 'Ножиці', 'Бумага'];
  typesMap = new Map();

  constructor(
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.typesMap.set(0, 'Камінь');
    this.typesMap.set(1, 'Ножиці');
    this.typesMap.set(2, 'Бумага');
  }

  public chooseWinner(choice: number): void {
    const request = {
      user1Choice: choice,
      user1Grades: this.score.player1,
      user2Grades: this.score.player2,
      matrix: this.getMatrix()
    };
    this.dataService.chooseWinner(request).subscribe(data => {
      this.score.player1 = data.user1Grades;
      this.score.player2 = data.user2Grades;
      if (this.score.player1 === 7 || this.score.player2 === 7) {
        const winner = this.score.player1 === 7 ? 'Гравець 1' : 'Гравець 2';
        const ref = this.snackBar.open(`${winner} переміг у грі`, 'Почати спочатку', {
          verticalPosition: 'top',
          duration: 5000
        });
        ref.afterDismissed().subscribe(() => this.setDefaultData());
      } else {
        let message = '';
        if (data.winnerName === 'person1') {
          message = 'Ви перемогли у цьому раунді.';
        } else if (data.winnerName === 'person2') {
          message = 'Гравець 2 перміг у цьому раунді.';
        } else {
          message = 'Нічия у цьому раунді.';
        }
        this.snackBar.open(`Гравець 2 обрав предмет ${this.typesMap.get(data.choiceOfUser2)}. ${message}`, 'Закрити', {
          verticalPosition: 'top',
          duration: 5000
        });
      }
    });
  }

  private setDefaultData(): void {
    this.score.player1 = 0;
    this.score.player2 = 0;
    this.cdRef.detectChanges();
    const form = [
      { name: 'Камінь', a: 0, b: 1, c: -1 },
      { name: 'Ножиці', a: -1, b: 0, c: 1 },
      { name: 'Бумага', a: 1, b: -1, c: 0 }
    ];
    this.form.patchValue(form);
  }

  private getMatrix(): any {
    return this.form.value.map((i: any) => Object.values(i).filter((_, index) => index).map((item: any) => parseInt(item, 10)));
  }

  private initForm(): void {
    this.form = new FormArray([
      this.getGroup('Камінь', 0, 1, -1),
      this.getGroup('Ножиці', -1, 0, 1),
      this.getGroup('Бумага', 1, -1, 0)
    ]);
  }

  private getGroup(name: string, a: number, b: number, c: number): FormGroup {
    return new FormGroup({
      name: new FormControl(name),
      a: new FormControl(a),
      b: new FormControl(b),
      c: new FormControl(c)
    });
  }

  public showTip(): void {
    const request = {
      matrix: this.getMatrix()
    };
    this.dataService.getTip(request).subscribe((data: any) => {
      this.snackBar.open(data.message, 'Закрити', {
        verticalPosition: 'top',
        duration: 5000
      });
    });
  }

}
