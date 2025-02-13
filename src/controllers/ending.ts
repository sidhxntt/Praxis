import figlet from "figlet";
import chalk from "chalk";

function EndMessage(text: string) {
  figlet(text, function (err, data) {
    if (err) {
      console.log(chalk.red("Something went wrong..."));
      console.dir(err);
      return;
    }
    console.log(chalk.cyan(data));
  });
}

export default EndMessage;
