import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="card-glass">
          <h1 className="text-3xl font-bold mb-6">About Eclipz</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3">
                About the Developer
              </h2>
              <p className="text-muted-foreground mb-4">
                Eclipz was built to blend anonymity, a clean UI, and just a hint
                of mystery. It's a space where you can say anything while
                staying anonymous. I’m passionate about minimal design, deep
                conversations, and learning something new every day.
              </p>
              <p className="text-muted-foreground mb-4">
                Hey, I'm Anurag – a React developer from Pune 🇮🇳. When I’m not
                solving LeetCode or building projects, you’ll probably find me
                reflecting on the Word and thanking God for the journey.
              </p>
              <p className="text-muted-foreground mb-4">
                Eclipz does not tolerate harassment, explicit content, or
                abusive messages. Upcoming updates will introduce sender
                blocking and a profanity filter to help protect your inbox.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Built using</h2>
              <div className="flex flex-wrap gap-2">
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  React
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  Vite
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  Firebase
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  Tailwind CSS
                </span>
                <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                  Node.js
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Fueled by</h2>
              <p className="text-muted-foreground">
                Faith, caffeine, and curiosity.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/80">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
