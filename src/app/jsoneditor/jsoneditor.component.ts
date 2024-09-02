import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jsoneditor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './jsoneditor.component.html',
  styleUrl: './jsoneditor.component.css'
})
export class JSONeditorComponent implements OnInit {
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

  ngOnInit() {
    this.loadJsonToEditor();
  }


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

  loadJsonToEditor() {
    const jsonObject = JSON.parse(this.jsonInput);
    console.log(jsonObject);
    console.log(this.jsonInput.split('\n'));
    const editor = document.querySelector('.jsoneditor') as HTMLDivElement;
    const olddiv = editor.querySelector('.test') as HTMLDivElement;

     this.jsonInput.split('\n').forEach((line) => {
      this.createNewDiv(editor, olddiv, line);
     });
  }

  createNewDiv(editor: HTMLDivElement, olddiv: HTMLDivElement,value: string) {
      const div = olddiv ? (olddiv.cloneNode(true) as HTMLDivElement) : document.createElement('div');
      div.className = 'test';
      div.innerText = `${value}`;
      div.contentEditable = 'true';
      div.addEventListener('keydown', this.onKeyInput.bind(this));
      editor.appendChild(div);
  }

    onClick(event: MouseEvent) {
    
    const json = (document.querySelector('.jsoneditor') as HTMLDivElement).innerText.replace(/\u00A0/g, '');
    console.log(json);
    try {
      
      const parsed = JSON.parse(json);
      this.jsonInput = JSON.stringify(parsed, null, 4);
      this.validationMessage = 'Valid JSON';
    } catch (e) {
      this.validationMessage = 'Invalid JSON';
    }
  }

  onKeyInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const previousDiv = event.target as HTMLDivElement;
      const newDiv = previousDiv.cloneNode(true) as HTMLDivElement;
      newDiv.innerHTML = '';
      newDiv.onkeydown = this.onKeyInput.bind(this);
      previousDiv.after(newDiv);
      newDiv.scrollIntoView({ behavior: 'smooth' });
      newDiv.focus();
    }
    
    if(event.key === 'Backspace') {
      const target = event.target as HTMLDivElement;
      const selection = window.getSelection();
      const range = selection!.getRangeAt(0);
      if (range.startOffset === 0) {
        const previousDiv = target.previousElementSibling as HTMLDivElement;
        if (previousDiv) {
          event.preventDefault();
          previousDiv.focus();
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(previousDiv);
          range.collapse(false);
          selection!.removeAllRanges();
          selection!.addRange(range);
          target.remove();
        }
      }
    
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.target as HTMLDivElement;
      const selection = window.getSelection();
      const range = selection!.getRangeAt(0);

      const tabNode = document.createTextNode('\u00A0\u00A0\u00A0\u00A0');
      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      selection!.removeAllRanges();
      selection!.addRange(range);
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const target = event.target as HTMLDivElement;
      const selection = window.getSelection();
      const range = selection!.getRangeAt(0);
      const caretOffset = range.startOffset;

      let sibling: HTMLDivElement | null = null;
      if (event.key === 'ArrowUp') {
        sibling = target.previousElementSibling as HTMLDivElement;
      } else if (event.key === 'ArrowDown') {
        sibling = target.nextElementSibling as HTMLDivElement;
      }

      if (sibling) {
        event.preventDefault();
        sibling.focus();
        const newRange = document.createRange();
        const newCaretOffset = Math.min(caretOffset, sibling.innerText.length);
        newRange.setStart(sibling.firstChild!, newCaretOffset);
        newRange.setEnd(sibling.firstChild!, newCaretOffset);
        selection!.removeAllRanges();
        selection!.addRange(newRange);
      }
    }
  }
}
