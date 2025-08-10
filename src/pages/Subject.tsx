import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

const mathQuestions: Question[] = [
  { id: "q1", prompt: "What is 7 × 8?", options: ["48", "54", "56", "64"], answerIndex: 2 },
  { id: "q2", prompt: "Simplify: 12/18", options: ["2/3", "3/4", "4/6", "6/9"], answerIndex: 0 },
  { id: "q3", prompt: "What is the value of x in 2x + 6 = 18?", options: ["5", "6", "7", "8"], answerIndex: 0 },
  { id: "q4", prompt: "Perimeter of a rectangle 5 by 9?", options: ["14", "28", "45", "90"], answerIndex: 1 },
  { id: "q5", prompt: "Which is a prime number?", options: ["21", "29", "39", "51"], answerIndex: 1 },
  { id: "q6", prompt: "Convert 0.75 to a fraction.", options: ["1/3", "2/3", "3/4", "4/5"], answerIndex: 2 },
  { id: "q7", prompt: "Area of a triangle with base 12 and height 5.", options: ["17", "30", "32", "60"], answerIndex: 1 },
  { id: "q8", prompt: "What is 15% of 200?", options: ["25", "30", "35", "45"], answerIndex: 1 },
];

const SUBJECTS: Record<string, { title: string; hasQuiz: boolean; questions?: Question[] }> = {
  mathematics: { title: "Mathematics", hasQuiz: true, questions: mathQuestions },
  science: { title: "Science", hasQuiz: false },
  english: { title: "English", hasQuiz: false },
  history: { title: "History", hasQuiz: false },
  geography: { title: "Geography", hasQuiz: false },
  "computer-science": { title: "Computer Science", hasQuiz: false },
  art: { title: "Art", hasQuiz: false },
  music: { title: "Music", hasQuiz: false },
};

export default function Subject() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const subject = useMemo(() => (slug ? SUBJECTS[slug] : undefined), [slug]);

  if (!subject) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <SEO title="Subject Not Found | Reviewer" description="Requested subject was not found." canonicalPath={`/subject/${slug ?? ''}`} />
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Subject not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please go back and choose a valid subject.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary"><Link to="/">Back to Subjects</Link></Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (!subject.hasQuiz) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <SEO title={`${subject.title} Reviewer | Coming Soon`} description={`${subject.title} reviewer is coming soon.`} canonicalPath={`/subject/${slug}`} />
        <Card className="max-w-xl w-full">
          <CardHeader>
            <CardTitle>{subject.title} Reviewer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This subject's reviewer is coming soon. Check back later!</p>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button asChild variant="secondary"><Link to="/">Back to Subjects</Link></Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const questions = subject.questions!;
  return <Quiz title={`${subject.title} Reviewer`} questions={questions} onFinish={(score, total) => {
    const percent = Math.round((score / total) * 100);
    toast({ title: "Quiz Completed", description: `You scored ${score}/${total} (${percent}%). Great work!` });
  }} />
}

function Quiz({ title, questions, onFinish }: { title: string; questions: Question[]; onFinish?: (score: number, total: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const progress = Math.round(((answers.filter(a => a !== null).length) / total) * 100);

  const selectAnswer = (index: number) => {
    setAnswers(prev => prev.map((a, i) => i === current ? index : a));
  };

  const next = () => setCurrent(c => Math.min(c + 1, total - 1));
  const prev = () => setCurrent(c => Math.max(c - 1, 0));

  const canNext = answers[current] !== null;
  const canSubmit = answers.every(a => a !== null);

  const submit = () => {
    const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answerIndex ? 1 : 0), 0);
    setSubmitted(true);
    onFinish?.(score, total);
  };

  if (submitted) {
    const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answerIndex ? 1 : 0), 0);
    const percent = Math.round((score / total) * 100);
    return (
      <main className="min-h-screen bg-background">
        <SEO title={`${title} | Results`} description={`Your results for ${title}.`} canonicalPath={window.location.pathname} />
        <section className="container py-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">You scored <span className="font-semibold text-foreground">{score}</span> out of {total}.</p>
              <Progress value={percent} />
              <p className="text-sm">Percentage: <span className="font-medium">{percent}%</span></p>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="secondary" onClick={() => { setAnswers(Array(total).fill(null)); setCurrent(0); setSubmitted(false); }}>Retake</Button>
              <Button asChild><Link to="/">Back to Subjects</Link></Button>
            </CardFooter>
          </Card>
        </section>
      </main>
    );
  }

  const q = questions[current];
  const selected = answers[current];

  return (
    <main className="min-h-screen bg-background">
      <SEO title={`${title} | MCQ`} description={`Practice ${title} with multiple-choice questions.`} canonicalPath={window.location.pathname} />
      <header className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
        <div className="container py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--brand-foreground))]">{title}</h1>
          <p className="text-[hsl(var(--brand-foreground))]/80 mt-2">Answer the questions below. Your progress saves as you go.</p>
        </div>
      </header>
      <section className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground mt-2">Progress: {progress}% ({answers.filter(a => a !== null).length}/{total})</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Question {current + 1} of {total}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{q.prompt}</p>
              <RadioGroup value={selected !== null ? String(selected) : undefined} onValueChange={(v) => selectAnswer(Number(v))}>
                {q.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-3 py-2">
                    <RadioGroupItem id={`q-${q.id}-${idx}`} value={String(idx)} />
                    <Label htmlFor={`q-${q.id}-${idx}`}>{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={prev} disabled={current === 0}>Previous</Button>
              {current < total - 1 ? (
                <Button onClick={next} disabled={!canNext}>Next</Button>
              ) : (
                <Button variant="hero" onClick={submit} disabled={!canSubmit}>Submit</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
