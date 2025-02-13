import os from "os"
import { execSync } from "child_process";
import chalkAnimation from "chalk-animation";

// Function to get a userinfo from os
function getUserName(): string {
  const userInfo = os.userInfo();
  return process.env.USER || process.env.USERNAME || userInfo.username || "Developer";
}

// Function to get a time-based greeting
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 16) return "Good afternoon"; 
  if (hour >= 16 && hour < 20) return "Good evening"; 
  if (hour >= 20 && hour < 24) return "Night coding session for"; 
  if (hour >= 24 || hour < 5) return "Really now? It's late! Time to rest"; 

  return "Hello"; // Fallback
}

// Function to check if Git is installed
function isGitInstalled(): boolean {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Function to display a random ASCII animation
async function showRandomAnimation(message: string): Promise<void> {
  const animation = chalkAnimation.karaoke(message);
  await new Promise((resolve) => setTimeout(resolve, 2500)); 
  animation.stop();
}

// string modification
function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export {getUserName, getTimeBasedGreeting, isGitInstalled, showRandomAnimation, capitalizeFirstLetter}