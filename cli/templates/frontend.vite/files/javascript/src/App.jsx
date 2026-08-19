import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <main className="grid min-h-screen place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{{projectName}}</h1>
        <p className="my-4 text-slate-600">Built with Praxis Flow.</p>
        <Button>Get started</Button>
      </div>
    </main>
  );
}
