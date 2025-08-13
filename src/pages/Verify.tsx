import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const Verify: React.FC = () => {
  const [params] = useSearchParams();
  const name = params.get("name") || "Unknown";
  const section = params.get("section") || "Unknown";
  const subject = params.get("subject") || "Quiz";
  const score = Number(params.get("score") || 0);
  const total = Number(params.get("total") || 0);
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const title = `${subject} Result: ${name}`;
  const description = `Verification of ${name} from ${section} — ${subject} score ${score}/${total} (${percent}%).`;

  return (
    <>
      <SEO
        title={`${subject} Verification | ${name}`}
        description={description}
        canonicalPath={typeof window !== "undefined" ? window.location.pathname : undefined}
      />
      <main className="container mx-auto max-w-2xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground">This page verifies the quiz result encoded in the QR code.</p>
        </header>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Student</span>
              <span className="font-medium text-foreground">{name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Section</span>
              <span className="font-medium text-foreground">{section}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subject</span>
              <span className="font-medium text-foreground">{subject}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Score</span>
              <span className="font-medium text-foreground">{score} / {total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Percentage</span>
              <span className="font-medium text-foreground">{percent}%</span>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Verify;
