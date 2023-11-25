// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios = require("axios");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

const print = (text) => {
  vscode.window.showInformationMessage(text);
};

const login = async (state) => {
  const username = await vscode.window.showInputBox({
    title: "Login",
    prompt: "Enter your username",
  });

  const password = await vscode.window.showInputBox({
    title: "Login",
    prompt: "Enter your password",
  });

  try {
    const res = await axios.post("http://localhost:3001/users/login", {
      username,
      password,
    });

    const data = res.data;
    state.write({ userDetails: data });

    print(" Login successfull" + data);
  } catch (error) {
    print(error.message);
  }
};

const register = async () => {
  const username = await vscode.window.showInputBox({
    title: "Register",
    prompt: "Enter your username",
  });

  const name = await vscode.window.showInputBox({
    title: "Register",
    prompt: "Enter your name",
  });

  const password = await vscode.window.showInputBox({
    title: "Register",
    prompt: "Enter your password",
  });

  try {
    const res = await axios.post("http://localhost:3001/users/register", {
      username,
      name,
      password,
    });

    const data = res.data;
    print("Registered successfully" + data);
  } catch (e) {
    print(e.message);
  }
};

function stateManager(context) {
  return {
    read,
    write,
  };

  function read() {
    return {
      userDetails: context.globalState.get("userDetails"),
    };
  }

  async function write(newState) {
    await context.globalState.update("userDetails", newState.userDetails);
  }
}

function resetState(context) {
  context.globalState.update("userDetails", undefined);
  vscode.window.showInformationMessage("Logged out successfully");
}

function activate(context) {
  const state = stateManager(context);
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "code-share" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "code-share.shareCode",
    async function () {
      if (!state.read().userDetails) {
        const action = await vscode.window.showInformationMessage(
          "Do you want to login or register?",
          { modal: true },
          "Login",
          "Register"
        );

        if (action === "Login") {
          await login(state);
        }

        if (action === "Register") {
          await register(state);
        }
      }

      if (state.read().userDetails) {
        vscode.window.showInformationMessage(
          `Welcome ${state.read().userDetails.username}`
        );
      }

      const actions = await vscode.window.showQuickPick(
        [
          {
            label: "Share Code",
            description: "Share your code",
          },
          {
            label: "Select code snippet",
            description: "Select code snippet",
          },
          {
            label: "Show friend request",
            description: "Show friend request",
          },
          {
            label: "Show friends",
            description: "Show friends",
          },
          {
            label: "Logout",
            description: "Logout",
          },
        ],
        {
          placeHolder: "Select an action",
        }
      );

      switch (actions.label) {
        case "Show friends":
          const friends = await axios.get(
            "http://localhost:3001/users/friends",
            {
              headers: {
                Authorization: `Bearer ${state.read().userDetails.token}`,
              },
            }
          );

          console.log(friends.data);
          // vscode.window.showInformationMessage(
          //   `Your friends are ${friends.data}`
          // );

          break;

        default:
          break;
      }
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
