import React from "react";
import "./ArticleSection.css";
import stayHydratedImg from '../../images/stay_hydrated.jpg';
import eatBalancedDietImg from '../../images/eat_balanced_diet.jpg';
import getRegularExerciseImg from '../../images/get_regular_exercise.jpg';
import prioritizeSleepImg from '../../images/prioritising_sleep.jpg';
import manageStressImg from '../../images/manage_stress.jpg';
import regularHealthCheckupsImg from '../../images/having_regular_health_checkups.jpg';
const ArticleSection = () => {
  const articles = [
    {
      title: "Stay hydrated",
      description:
        "Drinking enough water is essential for maintaining good health.",
      imageUrl: stayHydratedImg, // Replace with actual image path
    },
    {
      title: "Eat a Balanced Diet",
      description:
        "A balanced diet is key to overall well-being.",
      imageUrl: eatBalancedDietImg, // Replace with actual image path
    },
    {
      title: "Get Regular Exercise",
      description:
        "Exercise regularly to keep your body and mind healthy.",
      imageUrl: getRegularExerciseImg, // Replace with actual image path
    },
    {
      title: "Prioritize Sleep",
      description:
        "Good sleep is crucial for overall health.",
      imageUrl: prioritizeSleepImg, // Replace with actual image path
    },
    {
      title: "Manage Stress",
      description:
        "Finding ways to manage stress is essential for maintaining good health.",
      imageUrl: manageStressImg, // Replace with actual image path
    },
    {
      title: "Regular Health Check-Ups",
      description:
        "Regular check-ups can catch health issues early.",
      imageUrl: regularHealthCheckupsImg, // Replace with actual image path
    },
  ];

  return (
    <div className="article-section">
      <h2>Check out these health tips</h2>
      <div className="articles-container">
        {articles.map((article, index) => (
          <div key={index} className="article-card">
            <img src={article.imageUrl} alt={article.title} />
            <div className="article-content">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleSection;
