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

const researchQuestions: Question[] = [
  { id: "q1", prompt: "Which best describes Research?", options: ["Randomly collecting facts from the internet", "Systematically collecting, analyzing, and interpreting information to understand a topic", "Guessing outcomes based on personal experience", "Writing opinions without evidence"], answerIndex: 1 },
  { id: "q2", prompt: "Which type of research aims to expand general knowledge without direct practical use?", options: ["Applied Research", "Basic Research", "Descriptive Research", "Correlational Research"], answerIndex: 1 },
  { id: "q3", prompt: "Which research aims to solve specific, real-world problems?", options: ["Basic Research", "Experimental Research", "Applied Research", "Theoretical Research"], answerIndex: 2 },
  { id: "q4", prompt: "Which research design relies on numerical data to test hypotheses?", options: ["Quantitative Research", "Qualitative Research", "Mixed Methods", "Thematic Research"], answerIndex: 0 },
  { id: "q5", prompt: "What does Objectivity in research mean?", options: ["Relying on personal beliefs", "Being neutral and unbiased", "Collecting only data that supports the hypothesis", "Ignoring contradictory evidence"], answerIndex: 1 },
  { id: "q6", prompt: "Which reasoning starts from a general theory and tests it with specific data?", options: ["Inductive Reasoning", "Deductive Reasoning", "Comparative Reasoning", "Hypothetical Reasoning"], answerIndex: 1 },
  { id: "q7", prompt: "Applying mathematical techniques to interpret numerical data refers to:", options: ["Statistical Analysis", "Document Analysis", "Thematic Analysis", "Discourse Analysis"], answerIndex: 0 },
  { id: "q8", prompt: "Which research type focuses on exploring meanings and experiences using non-numerical data?", options: ["Quantitative Research", "Experimental Research", "Qualitative Research", "Statistical Research"], answerIndex: 2 },
  { id: "q9", prompt: "What does Subjectivity involve?", options: ["Using only measurable data", "Personal perspectives influencing interpretation", "Applying strict statistical rules", "Ignoring participant feedback"], answerIndex: 1 },
  { id: "q10", prompt: "Which reasoning develops theories from specific observations?", options: ["Deductive Reasoning", "Inductive Reasoning", "Objective Reasoning", "Statistical Reasoning"], answerIndex: 1 },
  { id: "q11", prompt: "Identifying and interpreting recurring ideas in qualitative data is called:", options: ["Document Analysis", "Thematic Analysis", "Statistical Analysis", "Experimental Analysis"], answerIndex: 1 },
  { id: "q12", prompt: "Studying how language is used to convey meaning in context is:", options: ["Discourse Analysis", "Thematic Analysis", "Document Analysis", "Content Validity"], answerIndex: 0 },
  { id: "q13", prompt: "Which method involves interpreting existing written materials?", options: ["Document Analysis", "Thematic Analysis", "Statistical Analysis", "Hypothesis Testing"], answerIndex: 0 },
  { id: "q14", prompt: "Qualitative research mainly looks for:", options: ["Trends in numbers", "Themes and patterns in narratives", "Cause-and-effect relationships", "Probability of outcomes"], answerIndex: 1 },
  { id: "q15", prompt: "Quantitative research mainly looks for:", options: ["Participant experiences", "Non-numerical meanings", "Measurable relationships or trends", "Ethical considerations"], answerIndex: 2 },
  { id: "q16", prompt: "Combining qualitative and quantitative methods in one study is:", options: ["Mixed Methods", "Cross-sectional Study", "Experimental Design", "Correlational Study"], answerIndex: 0 },
  { id: "q17", prompt: "A testable prediction about variable relationships is a:", options: ["Hypothesis", "Theory", "Observation", "Conclusion"], answerIndex: 0 },
  { id: "q18", prompt: "When one variable directly affects another, it’s called:", options: ["Correlation", "Causation", "Association", "Variation"], answerIndex: 1 },
  { id: "q19", prompt: "A statistical relationship without proven causation is:", options: ["Causation", "Correlation", "Randomization", "Sampling"], answerIndex: 1 },
  { id: "q20", prompt: "A sampling method giving every member a known chance of selection is:", options: ["Convenience Sampling", "Non-Probability Sampling", "Probability Sampling", "Purposive Sampling"], answerIndex: 2 },
  { id: "q21", prompt: "A sampling method where not everyone has an equal chance of selection is:", options: ["Probability Sampling", "Non-Probability Sampling", "Random Sampling", "Systematic Sampling"], answerIndex: 1 },
  { id: "q22", prompt: "Which research type systematically describes a situation without manipulating variables?", options: ["Descriptive Research", "Experimental Research", "Correlational Research", "Causal Research"], answerIndex: 0 },
  { id: "q23", prompt: "Which research investigates variable relationships without implying causation?", options: ["Experimental Research", "Correlational Research", "Descriptive Research", "Causal-Comparative Research"], answerIndex: 1 },
  { id: "q24", prompt: "When two variables move in the same direction, it’s:", options: ["Negative Correlation", "Zero Correlation", "Positive Correlation", "No Relationship"], answerIndex: 2 },
  { id: "q25", prompt: "When one variable increases while the other decreases, it’s:", options: ["Negative Correlation", "Positive Correlation", "Zero Correlation", "Random Variation"], answerIndex: 0 },
  { id: "q26", prompt: "Randomly assigning subjects into control and experimental groups defines:", options: ["Quasi-Experimental Research", "True Experimental Research", "Causal-Comparative Research", "Descriptive Research"], answerIndex: 1 },
  { id: "q27", prompt: "Assigning participants randomly to groups is called:", options: ["Stratification", "Randomization", "Clustering", "Sampling Frame"], answerIndex: 1 },
  { id: "q28", prompt: "Changing the independent variable to see its effect is:", options: ["Manipulation", "Correlation", "Sampling", "Reliability Testing"], answerIndex: 0 },
  { id: "q29", prompt: "The group in an experiment that does NOT receive treatment is:", options: ["Control Group", "Experimental Group", "Random Group", "Independent Group"], answerIndex: 0 },
  { id: "q30", prompt: "The group that receives the experimental treatment is:", options: ["Control Group", "Experimental Group", "Random Group", "Dependent Group"], answerIndex: 1 },
  { id: "q31", prompt: "Research without random assignment but still studying cause-effect is:", options: ["Quasi-Experimental", "True Experimental", "Descriptive", "Correlational"], answerIndex: 0 },
  { id: "q32", prompt: "Studying cause-effect relationships after the event without manipulating variables is:", options: ["Experimental", "Ex Post Facto / Causal-Comparative", "Correlational", "Descriptive"], answerIndex: 1 },
  { id: "q33", prompt: "Any characteristic or quantity that can change in research is a:", options: ["Constant", "Variable", "Hypothesis", "Parameter"], answerIndex: 1 },
  { id: "q34", prompt: "The variable manipulated to see its effect is:", options: ["Dependent Variable", "Independent Variable", "Control Variable", "Continuous Variable"], answerIndex: 1 },
  { id: "q35", prompt: "The measured outcome in an experiment is the:", options: ["Independent Variable", "Dependent Variable", "Categorical Variable", "Nominal Variable"], answerIndex: 1 },
  { id: "q36", prompt: "A variable with categories but no numeric meaning is:", options: ["Continuous Variable", "Categorical Variable", "Ratio Variable", "Interval Variable"], answerIndex: 1 },
  { id: "q37", prompt: "A variable with infinite possible values within a range is:", options: ["Continuous Variable", "Nominal Variable", "Ordinal Variable", "Categorical Variable"], answerIndex: 0 },
  { id: "q38", prompt: "A categorical variable without order is:", options: ["Nominal Variable", "Ordinal Variable", "Ratio Variable", "Interval Variable"], answerIndex: 0 },
  { id: "q39", prompt: "A categorical variable with a meaningful order is:", options: ["Interval Variable", "Nominal Variable", "Ordinal Variable", "Ratio Variable"], answerIndex: 2 },
  { id: "q40", prompt: "A numeric variable with equal intervals but no true zero is:", options: ["Interval Variable", "Ratio Variable", "Nominal Variable", "Ordinal Variable"], answerIndex: 0 },
  { id: "q41", prompt: "A numeric variable with equal intervals and a true zero is:", options: ["Interval Variable", "Ratio Variable", "Nominal Variable", "Ordinal Variable"], answerIndex: 1 },
  { id: "q42", prompt: "Assigning numbers or labels to characteristics based on rules is:", options: ["Reliability", "Measurement", "Validity", "Sampling"], answerIndex: 1 },
  { id: "q43", prompt: "The consistency of a measurement tool over time is:", options: ["Validity", "Reliability", "Measurement", "Randomization"], answerIndex: 1 },
  { id: "q44", prompt: "The extent to which a tool measures what it claims to measure is:", options: ["Reliability", "Validity", "Accuracy", "Precision"], answerIndex: 1 },
  { id: "q45", prompt: "The degree to which a tool measures a theoretical concept is:", options: ["Content Validity", "Construct Validity", "Criterion Validity", "Reliability"], answerIndex: 1 },
  { id: "q46", prompt: "Representing all topics of a content area in a test is:", options: ["Construct Validity", "Content Validity", "Criterion Validity", "Face Validity"], answerIndex: 1 },
  { id: "q47", prompt: "Predicting outcomes using an established standard refers to:", options: ["Criterion Validity", "Content Validity", "Construct Validity", "Statistical Validity"], answerIndex: 0 },
  { id: "q48", prompt: "The entire group a researcher wants to study is the:", options: ["Population", "Sample", "Sampling Frame", "Cluster"], answerIndex: 0 },
  { id: "q49", prompt: "A smaller group selected from the population is the:", options: ["Sample", "Population", "Cluster", "Stratum"], answerIndex: 0 },
  { id: "q50", prompt: "The list of all members from which a sample is drawn is the:", options: ["Population", "Sampling Frame", "Cluster", "Sample"], answerIndex: 1 },
  { id: "q51", prompt: "A sampling method giving equal chances to all members is:", options: ["Non-Probability Sampling", "Convenience Sampling", "Probability Sampling", "Purposive Sampling"], answerIndex: 2 },
  { id: "q52", prompt: "A sampling method without equal chances for all members is:", options: ["Probability Sampling", "Non-Probability Sampling", "Simple Random Sampling", "Systematic Sampling"], answerIndex: 1 },
  { id: "q53", prompt: "A probability sampling technique where each member has equal chance is:", options: ["Simple Random Sampling", "Convenience Sampling", "Purposive Sampling", "Snowball Sampling"], answerIndex: 0 },
  { id: "q54", prompt: "Selecting participants at regular intervals from a list is:", options: ["Stratified Sampling", "Cluster Sampling", "Systematic Sampling", "Purposive Sampling"], answerIndex: 2 },
  { id: "q55", prompt: "Dividing a population into subgroups and sampling from each is:", options: ["Stratified Sampling", "Cluster Sampling", "Simple Random Sampling", "Systematic Sampling"], answerIndex: 0 },
  { id: "q56", prompt: "Selecting entire groups (clusters) at random is:", options: ["Stratified Sampling", "Cluster Sampling", "Systematic Sampling", "Simple Random Sampling"], answerIndex: 1 },
  { id: "q57", prompt: "Choosing participants who are easiest to reach is:", options: ["Convenience Sampling", "Purposive Sampling", "Random Sampling", "Cluster Sampling"], answerIndex: 0 },
];

const SUBJECTS: Record<string, { title: string; hasQuiz: boolean; questions?: Question[] }> = {
  research: { title: "Research", hasQuiz: true, questions: researchQuestions },
  "general-mathematics": { title: "General Mathematics", hasQuiz: false },
  "earth-and-life-science": { title: "Earth and Life Science", hasQuiz: false },
  "physical-science": { title: "Physical Science", hasQuiz: false },
  "21st-century-literature": { title: "21st Century Literature", hasQuiz: false },
  "oral-communication": { title: "Oral Communication", hasQuiz: false },
  "reading-and-writing-skills": { title: "Reading and Writing Skills", hasQuiz: false },
  "media-and-information-literacy": { title: "Media and Information Literacy", hasQuiz: false },
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
