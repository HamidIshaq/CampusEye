import React from 'react';
import { Card, CardContent } from '../Components/Card';
import { motion } from 'framer-motion';
import TeamImage from '../Assets/motivation.png';
import SupervisorImage from '../Assets/sir-aadil.png';
import MotivationImage from '../Assets/motivation.png';
import SolutionImage from '../Assets/motivation.png';
import MethodologyImage from '../Assets/motivation.png';

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="h-screen overflow-y-auto p-6 md:p-10 space-y-16">
      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {[
            {
              name: 'Hamid Ishaq',
              email: 'i210476@nu.edu.pk',
              image: TeamImage,
            },
            {
              name: 'M. Hasaam',
              email: 'i210698@nu.edu.pk',
              image: TeamImage,
            },
            {
              name: 'M. Abdullah',
              email: 'i2102976@nu.edu.pk',
              image: TeamImage,
            },
          ].map((member, index) => (
            <motion.div
              key={member.email}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="flex flex-col items-center p-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h4 className="font-semibold text-lg">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Supervisor Section */}
      <SectionBlock
        title="Supervisor"
        image={SupervisorImage}
        text="Mr. M. Aadil Ur Rehman is supervising the CampusEye project with exceptional guidance and domain expertise, ensuring practical execution and relevance."
        reverse={false}
      />

      {/* Motivation Section */}
      <SectionBlock
        title="Motivation"
        image={MotivationImage}
        text="Campuses often face security threats such as fights, vandalism, or smoking violations. Traditional CCTV systems only record, but fail to detect and alert in real time. CampusEye addresses this gap by bringing intelligent monitoring and proactive alerts to life."
        reverse={true}
      />

      {/* Solution Section */}
      <SectionBlock
        title="Our Solution"
        image={SolutionImage}
        text="CampusEye is a Real-time anomaly detection system powered by distributed computing. It detects anomalies like Violence, Vandalism, and Smoking from CCTV footage. A master node distributes frame chunks to idle worker nodes on the network for real-time inference."
        reverse={false}
      />

      {/* Methodologies Section */}
      <SectionBlock
        title="Methodologies & Tech Stack"
        image={MethodologyImage}
        text="We use Kafka for message streaming between master and workers, YOLO for real-time object detection, and distributed processing to make the system scalable and cost-effective. Alerts are pushed instantly and data is stored for audit."
        reverse={true}
      />
    </div>
  );
};

const SectionBlock = ({ title, text, image, reverse }) => {
  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-10 ${
        reverse ? 'md:flex-row-reverse' : ''
      }`}
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="md:w-1/2">
        <img src={image} alt={title} className="rounded-2xl shadow-md w-full" />
      </div>
      <div className="md:w-1/2 space-y-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-gray-700 text-lg leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
};

export default AboutPage;
