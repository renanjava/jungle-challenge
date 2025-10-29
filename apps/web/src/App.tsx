import {Button} from './components/ui/button'

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold">Hello Tailwind! 🌟</h1>
       <div className="p-4 space-x-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
    </div>
  );
}
