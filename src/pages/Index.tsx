import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const subjects = [
  { title: "Mathematics", slug: "mathematics", ready: true },
  { title: "Science", slug: "science", ready: false },
  { title: "English", slug: "english", ready: false },
  { title: "History", slug: "history", ready: false },
  { title: "Geography", slug: "geography", ready: false },
  { title: "Computer Science", slug: "computer-science", ready: false },
  { title: "Art", slug: "art", ready: false },
  { title: "Music", slug: "music", ready: false },
];

export default function Index() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Subject Reviewer | 8 Subjects MCQ"
        description="Choose from 8 subjects to practice multiple-choice reviewers. Start with Mathematics."
        canonicalPath="/"
      />
      <header className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
        <div className="container py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--brand-foreground))]">Student Subject Reviewer</h1>
          <p className="mt-3 text-[hsl(var(--brand-foreground))]/80 max-w-2xl">Practice multiple-choice tests to prepare and track your progress. Mathematics is available now; more subjects coming soon.</p>
          <div className="mt-6">
            <Button asChild variant="hero" size="lg">
              <Link to="/subject/mathematics">Start Mathematics</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container py-10">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((s) => (
            <Card key={s.slug} className="transition-transform transform-gpu hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{s.ready ? "Multiple-choice reviewer available." : "Reviewer coming soon."}</p>
              </CardContent>
              <CardFooter>
                {s.ready ? (
                  <Button asChild className="w-full">
                    <Link to={`/subject/${s.slug}`}>Start Review</Link>
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
