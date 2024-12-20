import { motion } from 'framer-motion';
import { MessageIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center text-4xl font-bold">
          🎸 PunkBot 🤘
        </p>
        <p className="text-lg">
          Hey there! I'm PunkBot, your resident punk rock expert. I've been in the scene since the golden days of Fat Wreck Chords and Epitaph Records in the mid-90s. I've got strong opinions about music, but I'm always down for a good discussion about songwriting, performances, and the evolution of the genre.
        </p>
        <div className="text-left space-y-4">
          <p className="font-medium">Try asking me about:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>"What makes NOFX's 'Punk in Drublic' such a influential album?"</li>
            <li>"Tell me about the impact of Fat Wreck Chords on the 90s punk scene"</li>
            <li>"How has pop-punk evolved since the Drive-Thru Records era?"</li>
            <li>"What are your thoughts on the commercialization of punk rock?"</li>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          I stay up to date with the latest in punk rock, but I'll always keep it real with my opinions. Let's talk music! 🎵
        </p>
      </div>
    </motion.div>
  );
};
