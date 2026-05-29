import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md";

type ProjectLink = { label: string; url: string };

type Project = {
  title: string;
  category: string;
  description?: string;
  stack?: string;
  howItWorks?: string;
  tools?: string;
  proof?: string;
  image: string;
  links: ProjectLink[];
};

const NOTION_MENDEL =
  "https://misty-hat-c27.notion.site/Mendel-Autonomous-OSS-Maintenance-Agent-364a2e9f37e281be9ae0c38bce86fa32";

const projects: Project[] = [
  {
    title: "Mendel",
    category:
      "Autonomous agent that ships breaking-change dependency upgrades as real GitHub PRs — honest about exactly what it didn't verify · personal project",
    description:
      "Detects stale dependencies with breaking changes, generates the migration patch with cited evidence, verifies it in an isolated Docker sandbox, and opens a Draft PR — every one scored with a calibrated confidence number and a “Not Analyzed” disclosure. Built to never claim more certainty than it has.",
    stack:
      "Next.js 15 · TypeScript (strict) · Docker two-phase sandbox · Gemini · Octokit · Prisma · Zod",
    howItWorks:
      "Dual-signal detection (changelog + semantic API diff) · calibrated confidence scoring · isolated sandbox verification · auto-fork + Draft PRs",
    proof:
      "Real PRs on public OSS · every PR carries a numeric confidence score + “Not Analyzed” list · two-phase network-isolated sandbox",
    image: "/images/mendel.png",
    links: [
      { label: "Case Study", url: NOTION_MENDEL },
      { label: "GitHub", url: "https://github.com/megadave19/mendel" },
    ],
  },
  {
    title: "Sales Intelligence Platform",
    category: "0-to-1 internal B2B SaaS · sovity GmbH",
    tools:
      "Product Discovery, LLM Workflows, HubSpot & Support Aggregation, Churn & Upsell Dashboards",
    image: "/images/ssi.png",
    links: [
      {
        label: "Case Study",
        url: "https://www.notion.so/Antarang-Gaur-356a2e9f37e281ff8fe9ef90ab8bd7a4",
      },
    ],
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        {project.description && (
                          <p className="carousel-description">
                            {project.description}
                          </p>
                        )}
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          {project.stack || project.howItWorks ? (
                            <>
                              {project.stack && (
                                <p className="carousel-tool-row">
                                  <span className="tool-row-key">Stack</span>
                                  {project.stack}
                                </p>
                              )}
                              {project.howItWorks && (
                                <p className="carousel-tool-row">
                                  <span className="tool-row-key">
                                    How it works
                                  </span>
                                  {project.howItWorks}
                                </p>
                              )}
                            </>
                          ) : (
                            <p>{project.tools}</p>
                          )}
                        </div>
                        {project.proof && (
                          <p className="carousel-proof">{project.proof}</p>
                        )}
                        <div className="carousel-cta">
                          {project.links.map((l) => (
                            <a
                              key={l.url}
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="carousel-cta-btn"
                              data-cursor="disable"
                            >
                              {l.label} <MdArrowOutward />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.links[0]?.url}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
