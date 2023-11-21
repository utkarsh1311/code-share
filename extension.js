// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

const print = (text) => {
  vscode.window.showInformationMessage(text);
};

function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "code-share" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "code-share.shareCode",
    async function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      // const username = await vscode.window.showInputBox({
      // 	placeHolder: 'Enter your username',
      // 	prompt: 'Enter your username'
      // });

      // const password = await vscode.window.showInputBox({
      // 	placeHolder: 'Enter your password',
      // 	prompt: 'Enter your password',
      // 	password: true
      // });

      let options = [
        {
          description: "Function for loop",
          author: "Samarth",
          detail:
            "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          label: "samarthkumar19",
          code: `for (let i = 0; i < 10; i++) {
					        console.log(i);
				         }`,
        },
        {
          description: "Function for merge sort",
          author: "uddeshya",
          detail:
            "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          label: "uddeshya",
          code: `function mergeSort(array) {
					if (array.length <= 1) {
						return array;
				}
				const middle = Math.floor(array.length / 2);
				const left = array.slice(0, middle);
				const right = array.slice(middle);
				return merge(
					mergeSort(left), mergeSort(right)
				);
			}`,
        },
      ];

      //   const selected = await vscode.window.showQuickPick(options, {
      //     placeHolder: "Select a code snippet to share",
      //   });

      //   if (!selected) {
      //     return;
      //   }

      //   const { author, label, code } = selected;
      //   vscode.window.activeTextEditor.insertSnippet(
      //     new vscode.SnippetString(code)
      //   );

      //   vscode.env.clipboard.writeText(code);
      //   print("Code copied to clipboard");

      const editor = vscode.window.activeTextEditor;
      const selection = editor.selection;
      const text = editor.document.getText(selection);

      print(`Selected code is : 
	  	${text}`);

      const friends = [
        "Uddeshya",
        "Samarth",
        "Siddharth",
        "Saksham",
        "Saurabh",
      ];

      const selectedFriends = await vscode.window.showQuickPick(friends, {
        placeHolder: "Select a friend to share code with",
      });

      if (!selectedFriends) {
        return;
      }

      print("Code shared with " + selectedFriends);

      options.push({
        description: "Custom",
        label: "Custom",
        code: text,
      });

      await vscode.window.showQuickPick(options, {
        placeHolder: "Select a code snippet to share",
      });
      print("Code ready to share");
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
