import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jsoneditor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './jsoneditor.component.html',
  styleUrl: './jsoneditor.component.css'
})
export class JSONeditorComponent {
  jsonInput: string = `{
    "url-in-folder": "https://play.usos.edu.pl:9000/15EBD826-94B8-4408-A7CC-2ECBD7F21585/3fa85f64-5717-4562-b3fc- 2c963f66afa6/in",
    "url-out-folder": "https://play.usos.edu.pl:9000/15EBD826-94B8-4408-A7CC-2ECBD7F21585/3fa85f64-5717-4562- b3fc-2c963f66afa6/out",
    "sign-type": "QUALIFIED",
    "add-timestamp": false,
    "box-action": "SIGN",
    "order-type": "MINIO",
    "order-id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "user-id": "jsmith",
    "order-date": "2021-08-30T14:44:41.347Z",
    "url-back-page": "https://foo.com/signed/back"
}`;
  validationMessage: string = '';
  highlightedJson: string = '';


  validateAndFormatJSON() {
    try {
      const parsed = JSON.parse(this.jsonInput);
      this.jsonInput = JSON.stringify(parsed, null, 2);
      this.validationMessage = 'Valid JSON';
    } catch (e) {
      this.validationMessage = 'Invalid JSON';
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      this.jsonInput = this.jsonInput.substring(0, start) + '    ' + this.jsonInput.substring(end);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  }

  onInput(event: Event) {
    console.log(this.jsonInput);

    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const textBeforeCaret = this.jsonInput.substring(0, start);

    try {
      const parsed = JSON.parse(this.jsonInput);
      this.jsonInput = JSON.stringify(parsed, null, 4);
      this.validationMessage = 'Valid JSON';
    } catch (e) {
      this.validationMessage = 'Invalid JSON';
    }

    const newCaretPosition = textBeforeCaret.length;

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = newCaretPosition;
    }, 0);

    this.jsonInput = (event.target as HTMLTextAreaElement).value;
    this.highlightedJson = this.applySyntaxHighlighting(this.jsonInput);

  }

  applySyntaxHighlighting(json: string): string {
    // Simple example: highlight keys in red and values in blue
    return json.replace(/("[^"]*")(\s*:\s*)("[^"]*"|\d+)/g, (match, p1, p2, p3) => {
      return `<span style="color: red;">${p1}</span>${p2}<span style="color: blue;">${p3}</span>`;
    });
  }

}
