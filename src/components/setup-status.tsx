import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SetupStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Cookbook foundation ready</h2>
        </CardTitle>
        <CardDescription>
          The tools are in place. Recipes and the browsing experience come next.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Astro · static</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
          <Badge variant="secondary">React + shadcn/ui</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <a href="https://github.com/g-mai/foodbook">
            View the project on GitHub
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
