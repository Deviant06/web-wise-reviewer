import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const subjects = [{
  title: "Research",
  slug: "research",
  ready: true
}, {
  title: "General Mathematics",
  slug: "general-mathematics",
  ready: false
}, {
  title: "Earth and Life Science",
  slug: "earth-and-life-science",
  ready: false
}, {
  title: "Physical Science",
  slug: "physical-science",
  ready: false
}, {
  title: "21st Century Literature",
  slug: "21st-century-literature",
  ready: false
}, {
  title: "Oral Communication",
  slug: "oral-communication",
  ready: false
}, {
  title: "Reading and Writing Skills",
  slug: "reading-and-writing-skills",
  ready: false
}, {
  title: "Media and Information Literacy",
  slug: "media-and-information-literacy",
  ready: false
}];
export default function Index() {
  return <main className="min-h-screen bg-background">
      <SEO title="SHS Subject Reviewer | Research MCQ" description="Choose from 8 SHS subjects. Start the Research multiple-choice reviewer now." canonicalPath="/" />
      <header className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
        <div className="container py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--brand-foreground))]">Practical Research 2</h1>
          <p className="mt-3 text-[hsl(var(--brand-foreground))]/80 max-w-2xl">Kayang kaya niyo! Good luck, Grade 12!</p>
          <div className="mt-6">
            <Button asChild variant="hero" size="lg">
              <Link to="/subject/research">Start Research</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container py-10">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map(s => <Card key={s.slug} className="transition-transform transform-gpu hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{s.ready ? "Multiple-choice reviewer available." : "Reviewer coming soon."}</p>
              </CardContent>
              <CardFooter>
                {s.ready ? <Button asChild className="w-full">
                    <Link to={`/subject/${s.slug}`}>Start Review</Link>
                  </Button> : <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>}
              </CardFooter>
            </Card>)}
        </div>
      </section>
    </main>;
}