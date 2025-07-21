
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
                👨‍💻 About the Developer
              </h2>
              <p className="text-muted-foreground mb-4">
                Hey, I'm Anurag – React dev from Pune 🇮🇳.
              </p>
              <p className="text-muted-foreground mb-4">
                Eclipz was built to blend anonymity, UI, and a little mystery. I
                love clean UIs, deep chats, coding at 3AM, and learning
                something new every day. When I'm not doing LeetCode or making
                coffee for my mom, I'm probably deep in the Word, thanking God
                for another chance.
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
                  Tailwind
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Fueled by</h2>
              <p className="text-muted-foreground">
                Curiosity, caffeine, and Christ ✝️
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
