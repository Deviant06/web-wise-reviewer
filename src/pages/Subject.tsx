import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "react-qr-code";
import { supabase } from "@/integrations/supabase/client";
interface Question {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

const researchQuestions: Question[] = [
  { id: "q1", prompt: "Marital Status (Single, Married, Divorced, Widowed)", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 0 },
  { id: "q2", prompt: "Student's Grade Level (Grade 9, Grade 10, Grade 11, Grade 12)", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 1 },
  { id: "q3", prompt: "Temperature in Celsius", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 2 },
  { id: "q4", prompt: "Height in centimeters", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 3 },
  { id: "q5", prompt: "Favorite Color (Red, Blue, Green, Yellow)", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 0 },
  { id: "q6", prompt: "Ranking of Students in a Class (1st, 2nd, 3rd, etc.)", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 1 },
  { id: "q7", prompt: "Monthly Income in Dollars", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 3 },
  { id: "q8", prompt: "Type of Car Owned (Sedan, SUV, Truck, Coupe)", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 0 },
  { id: "q9", prompt: "Number of Siblings", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 3 },
  { id: "q10", prompt: "Time Taken to Complete a Test in Minutes", options: ["Nominal", "Ordinal", "Interval", "Ratio"], answerIndex: 3 },
  { id: "q11", prompt: "Which of the following best describes experimental research?", options: ["A systematic investigation that examines relationships between variables without manipulation", "A study that manipulates one variable to determine its effect on another while controlling other factors", "A type of research that collects data through surveys and interviews", "An analysis of existing literature to form conclusions"], answerIndex: 1 },
  { id: "q12", prompt: "In experimental research, the variable that is manipulated by the researcher is called the:", options: ["Dependent variable", "Control variable", "Independent variable", "Extraneous variable"], answerIndex: 2 },
  { id: "q13", prompt: "Which of the following best describes correlational research?", options: ["A study that manipulates variables to determine cause-and-effect relationships", "A study that measures the relationship between two or more variables without manipulation", "A type of research that tests interventions in controlled environments", "An analysis that only focuses on one variable at a time"], answerIndex: 1 },
  { id: "q14", prompt: "A group of participants in an experiment that receives the treatment or intervention.", options: ["Control group", "Experimental group", "Quasi-experimental", "Ex post facto research"], answerIndex: 1 },
  { id: "q15", prompt: "A group in an experiment does not receive the experimental treatment and is used as a benchmark to measure how the other tested subjects do.", options: ["Experimental group", "Thematic analysis", "Control group", "Deductive reasoning"], answerIndex: 2 },
  { id: "q16", prompt: "What process involves the intentional alteration of the independent variable to observe its effect on the dependent variable?", options: ["Inductive reasoning", "Randomization", "Manipulation of the IV", "Statistical analyses"], answerIndex: 2 },
  { id: "q17", prompt: "Which technique involves assigning subjects to different groups in an experiment by chance, minimizing pre-existing differences between those assigned to the different groups?", options: ["Randomization", "Quasi-experimental", "Control group", "Ex post facto research"], answerIndex: 0 },
  { id: "q18", prompt: "Which of the following is true about correlation and causation?", options: ["Correlation always means causation", "Correlation never has any relationship to causation", "Correlation can suggest a possible relationship, but it does not prove causation", "Correlation only occurs when one variable directly causes another"], answerIndex: 2 },
  { id: "q19", prompt: "What statistical test is used to measure the strength and direction of a linear relationship?", options: ["Independent sample T- test", "Pearson r", "Dependent Sample T-test", "ANOVA"], answerIndex: 1 },
  { id: "q20", prompt: "Relationship between two variables where an increase in one variable is associated with an increase in the other?", options: ["Negative correlation", "Positive correlation", "Type I error", "Causation"], answerIndex: 1 },
  { id: "q21", prompt: "What should be the decision if the P value < 0.05 hypothesis testing?", options: ["The data supports the null hypothesis", "There is a strong positive correlation", "Reject the null hypothesis", "A type II error has occurred"], answerIndex: 2 },
  { id: "q22", prompt: "What part of a research paper outlines the central question or focus of the study?", options: ["Statement of the problem", "Hypothesis", "Introduction", "Alternative hypothesis"], answerIndex: 0 },
  { id: "q23", prompt: "Which section of a research paper provides background information and context for the study?", options: ["Hypothesis", "Statement of the problem", "Introduction", "Conclusion"], answerIndex: 2 },
  { id: "q24", prompt: "What term is used for a specific, testable prediction about the expected outcome of a study?", options: ["Hypothesis", "Correlation", "Causation", "Type errors"], answerIndex: 0 },
  { id: "q25", prompt: "Hypothesis that suggests that there is a significant difference or effect, typically opposed to the null hypothesis.", options: ["Type II error", "Alternative hypothesis", "Introduction", "Causation"], answerIndex: 1 },
  { id: "q26", prompt: "Research Scenario 2: A researcher is investigating how varying light intensities in a room impact students' reading comprehension. Students read the same passage under three different lighting conditions (low, medium, and bright) and then take a comprehension test. What is the IV?", options: ["Light intensity", "Reading comprehension score", "Passage length", "Student grade level"], answerIndex: 0 },
  { id: "q27", prompt: "Research Scenario 2: A researcher is investigating how varying light intensities in a room impact students' reading comprehension. Students read the same passage under three different lighting conditions (low, medium, and bright) and then take a comprehension test. What is the DV?", options: ["Light intensity", "Student reading comprehension score", "Time spent reading", "Room temperature"], answerIndex: 1 },
  { id: "q28", prompt: "Research Scenario 3: A teacher wants to know if seating arrangements in the classroom influence student participation. In one arrangement, students sit in rows; in another, they sit in a circle; and in a third, they sit in groups. The number of times students participate in class discussions is counted. What is the IV?", options: ["Number of student participations", "Seating arrangement", "Teacher experience", "Class size"], answerIndex: 1 },
  { id: "q29", prompt: "Research Scenario 3: A teacher wants to know if seating arrangements in the classroom influence student participation. In one arrangement, students sit in rows; in another, they sit in a circle; and in a third, they sit in groups. The number of times students participate in class discussions is counted. What is the DV?", options: ["Seating arrangement", "Number of student participations", "Classroom temperature", "Lesson topic"], answerIndex: 1 },
  { id: "q30", prompt: "Research Scenario 4: An agricultural scientist is testing whether different types of fertilizers affect the yield of a wheat crop. The scientist applies three different fertilizers to separate plots and measures the amount of wheat harvested from each plot after the growing season. What is the IV?", options: ["Type of fertilizer", "Wheat yield", "Soil type", "Plot size"], answerIndex: 0 },
  { id: "q31", prompt: "Research Scenario 4: An agricultural scientist is testing whether different types of fertilizers affect the yield of a wheat crop. The scientist applies three different fertilizers to separate plots and measures the amount of wheat harvested from each plot after the growing season. What is the DV?", options: ["Type of fertilizer", "Wheat yield", "Watering schedule", "Harvest season"], answerIndex: 1 },
  { id: "q32", prompt: "Research Scenario 5: A school counselor wants to study whether the amount of time students spend on social media impacts their academic performance. The counselor tracks students' daily social media usage and compares it with their grades at the end of the term. What is the IV?", options: ["Academic performance", "Daily social media usage", "Student age", "Study habits"], answerIndex: 1 },
  { id: "q33", prompt: "Research Scenario 5: A school counselor wants to study whether the amount of time students spend on social media impacts their academic performance. The counselor tracks students' daily social media usage and compares it with their grades at the end of the term. What is the DV?", options: ["Daily social media usage", "Academic performance", "Number of friends", "Favorite social media platform"], answerIndex: 1 },
  { id: "q34", prompt: "Systematic process of collecting, analyzing, and interpreting data to solve problems.", options: ["Research", "Qualitative Research", "Quantitative Research", "Experimental Research"], answerIndex: 0 },
  { id: "q35", prompt: "Research that involves non-numerical data and focuses on understanding concepts, opinions, or experiences.", options: ["Qualitative Research", "Quantitative Research", "Experimental Research", "Correlational Research"], answerIndex: 0 },
  { id: "q36", prompt: "Research that deals with numerical data and statistical analysis to determine patterns and relationships.", options: ["Qualitative Research", "Quantitative Research", "Quasi-Experimental", "Experimental Research"], answerIndex: 1 },
  { id: "q37", prompt: "Research design that involves the manipulation of one or more variables to determine their effect on another variable.", options: ["Experimental Research", "Correlational Research", "Quasi-Experimental", "Manipulation"], answerIndex: 0 },
  { id: "q38", prompt: "Research design that is similar to true experimental research but lacks random assignment of participants to groups.", options: ["Quasi-Experimental", "Experimental Research", "Correlational Research", "Randomization"], answerIndex: 0 },
  { id: "q39", prompt: "Research that examines the relationship between two or more variables without manipulating them.", options: ["Correlational Research", "Experimental Research", "Quasi-Experimental", "Causation"], answerIndex: 0 },
  { id: "q40", prompt: "A variable that is manipulated or changed in an experiment to observe its effect on another variable.", options: ["Independent Variable", "Dependent Variable", "Ratio Variable", "Ordinal Variable"], answerIndex: 0 },
  { id: "q41", prompt: "A variable that is measured or observed in response to changes in the independent variable.", options: ["Dependent Variable", "Independent Variable", "Interval Variable", "Nominal Variable"], answerIndex: 0 },
  { id: "q42", prompt: "Any characteristic, number, or quantity that can be measured or quantified.", options: ["Variable", "Discrete/Categorical", "Continuous", "Manipulation"], answerIndex: 0 },
  { id: "q43", prompt: "A variable that categorizes data without any order or ranking.", options: ["Nominal Variable", "Ordinal Variable", "Interval Variable", "Ratio Variable"], answerIndex: 0 },
  { id: "q44", prompt: "A variable that categorizes data with a specific order or ranking but without consistent intervals between ranks.", options: ["Ordinal Variable", "Nominal Variable", "Interval Variable", "Ratio Variable"], answerIndex: 0 },
  { id: "q45", prompt: "Variable with equal intervals between values but no true zero point.", options: ["Interval Variable", "Ratio Variable", "Continuous", "Discrete/Categorical"], answerIndex: 0 },
  { id: "q46", prompt: "Variable with equal intervals and a true zero point.", options: ["Ratio Variable", "Interval Variable", "Independent Variable", "Dependent Variable"], answerIndex: 0 },
  { id: "q47", prompt: "Relationship between a variable that affects and a variable that is affected.", options: ["Causation", "Correlation", "Manipulation", "Randomization"], answerIndex: 0 },
  { id: "q48", prompt: "Process of assigning participants to different groups randomly to ensure each group is similar.", options: ["Randomization", "Manipulation", "Causation", "Quasi-Experimental"], answerIndex: 0 }
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
  const [student, setStudent] = useState<{ name: string; section: string } | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [sectionInput, setSectionInput] = useState("");

  const total = questions.length;
  const progress = Math.round(((answers.filter(a => a !== null).length) / total) * 100);

  const selectAnswer = (index: number) => {
    setAnswers(prev => prev.map((a, i) => i === current ? index : a));
  };

  const next = () => setCurrent(c => Math.min(c + 1, total - 1));
  const prev = () => setCurrent(c => Math.max(c - 1, 0));

  const canNext = answers[current] !== null;
  const canSubmit = answers.every(a => a !== null);

  const submit = async () => {
    const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answerIndex ? 1 : 0), 0);
    const percent = Math.round((score / total) * 100);
    
    // Save to Supabase
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          student_name: student.name,
          section: student.section,
          subject: title.replace(' Reviewer', ''), // Remove "Reviewer" suffix
          score,
          total_questions: total,
          percentage: percent
        });
      
      if (error) {
        console.error('Error saving quiz result:', error);
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
    
    setSubmitted(true);
    onFinish?.(score, total);
  };

  // Require student info before starting the quiz
  if (!student) {
    return (
      <main className="min-h-screen bg-background">
        <SEO title={`${title} | Start`} description={`Enter your details to begin ${title}.`} canonicalPath={window.location.pathname} />
        <section className="container py-10">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Full Name</Label>
                <Input id="student-name" placeholder="e.g., Juan Dela Cruz" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-section">Section</Label>
                <Select value={sectionInput} onValueChange={setSectionInput}>
                  <SelectTrigger id="student-section">
                    <SelectValue placeholder="Choose your section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COPPER">COPPER</SelectItem>
                    <SelectItem value="MERCURY">MERCURY</SelectItem>
                    <SelectItem value="GOLD">GOLD</SelectItem>
                    <SelectItem value="HELIUM">HELIUM</SelectItem>
                    <SelectItem value="NICKOL">NICKOL</SelectItem>
                    <SelectItem value="TITANIUM">TITANIUM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="hero"
                onClick={() => setStudent({ name: nameInput.trim(), section: sectionInput.trim() })}
                disabled={!nameInput.trim() || !sectionInput.trim()}
              >
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
    );
  }

  // Results with QR verification
  if (submitted) {
    const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answerIndex ? 1 : 0), 0);
    const percent = Math.round((score / total) * 100);
    const verifyUrl = new URL("/verify", window.location.origin);
    verifyUrl.searchParams.set("name", student.name);
    verifyUrl.searchParams.set("section", student.section);
    verifyUrl.searchParams.set("subject", title);
    verifyUrl.searchParams.set("score", String(score));
    verifyUrl.searchParams.set("total", String(total));

    return (
      <main className="min-h-screen bg-background">
        <SEO title={`${title} | Results`} description={`Your results for ${title}.`} canonicalPath={window.location.pathname} />
        <section className="container py-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Student</span>
                  <span className="font-medium text-foreground">{student.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Section</span>
                  <span className="font-medium text-foreground">{student.section}</span>
                </div>
              </div>
              <p className="text-muted-foreground">You scored <span className="font-semibold text-foreground">{score}</span> out of {total}.</p>
              <Progress value={percent} />
              <p className="text-sm">Percentage: <span className="font-medium">{percent}%</span></p>

              <div className="mt-6">
                <p className="mb-2 text-sm text-muted-foreground">Scan to verify:</p>
                <div className="flex items-center justify-center rounded-md border border-border bg-card p-4">
                  <QRCode value={verifyUrl.toString()} size={160} />
                </div>
              </div>
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
