import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LIBRARY_CATEGORIES = ["MIXER", "MORNINGS", "SLEEP"] as const;

const BUCKET = "meditation-assets";
const COURSE_TITLE = "3-Day Mindfulness Foundation Course";
const LEGACY_COURSE_TITLE = "3-Day Mindfulness Foundation";

const AMBIENT_TRACKS = [
  {
    name: "Deep Ocean",
    category: "nature",
    filename: "ambient/deep-ocean.mp3",
  },
  {
    name: "Forest Rain",
    category: "nature",
    filename: "ambient/forest-rain.mp3",
  },
  {
    name: "Singing Bowl Spectrum",
    category: "zen",
    filename: "ambient/singing-bowl-spectrum.mp3",
  },
  {
    name: "Pink Noise",
    category: "zen",
    filename: "ambient/pink-noise.mp3",
  },
] as const;

/** MVP: use uploaded ambient tracks until TTS guides exist at course/day-N-guide.mp3 */
const COURSE_STEPS = [
  {
    daySequence: 1,
    title: "Day 1: Breath Awareness",
    audioName: "Day 1 — Vocal Guide",
    guideFile: "ambient/1.jpg",
    loopFile: null,
  },
  {
    daySequence: 2,
    title: "Day 2: Body Scan",
    audioName: "Day 2 — Vocal Guide",
    guideFile: "ambient/deep-ocean.mp3",
    loopFile: null,
  },
  {
    daySequence: 3,
    title: "Day 3: Embracing Emotions",
    audioName: "Day 3 — Vocal Guide",
    guideFile: "ambient/singing-bowl-spectrum.mp3",
    loopFile: null,
  },
] as const;

/** weekdayIndex 0 = Sunday … 6 = Saturday (matches Date.getDay()) */
const DAILY_GUIDE_FILES = [
  "ambient/forest-rain.mp3",
  "ambient/deep-ocean.mp3",
  "ambient/singing-bowl-spectrum.mp3",
  "ambient/pink-noise.mp3",
  "ambient/forest-rain.mp3",
  "ambient/deep-ocean.mp3",
  "ambient/singing-bowl-spectrum.mp3",
] as const;

const DAILY_ZEN_THEMES = [
  {
    weekdayIndex: 0,
    name: "Daily Zen — Sunday Stillness",
    theme: "Sunday Stillness",
    duration: 300,
  },
  {
    weekdayIndex: 1,
    name: "Daily Zen — Monday Grounding",
    theme: "Monday Grounding",
    duration: 240,
  },
  {
    weekdayIndex: 2,
    name: "Daily Zen — Tuesday Clarity",
    theme: "Tuesday Clarity",
    duration: 240,
  },
  {
    weekdayIndex: 3,
    name: "Daily Zen — Wednesday Flow",
    theme: "Wednesday Flow",
    duration: 180,
  },
  {
    weekdayIndex: 4,
    name: "Daily Zen — Thursday Release",
    theme: "Thursday Release",
    duration: 240,
  },
  {
    weekdayIndex: 5,
    name: "Daily Zen — Friday Ease",
    theme: "Friday Ease",
    duration: 180,
  },
  {
    weekdayIndex: 6,
    name: "Daily Zen — Saturday Rest",
    theme: "Saturday Rest",
    duration: 300,
  },
] as const;

type CategoryLibrarySeedItem = {
  name: string;
  category: (typeof LIBRARY_CATEGORIES)[number];
  introduction: string;
  coverUrl: string;
  url: string;
  duration: number;
  author: string;
  sortOrder: number;
};

const CATEGORY_LIBRARY_SEED = [
  {
    name: "Total Body Relaxation",
    category: "MIXER",
    introduction:
      `🧘 Join the meditation challenge + get the free PDF tracker: https://lavendaire.com/30-day-meditation

        Welcome to Week 2 of the 30 Day meditation Challenge: A 10 minute meditation to release stress & anxiety, featuring a body scan for total body relaxation and positive affirmations. Great for beginners and all levels. Do this 10 min meditation daily for one week, before moving onto the next meditation.

        ⭐ Week 1: 5 Minute Meditation for Relaxation & Positive Energy |    • 5 Minute Meditation for Relaxation & Posit...  

        Can you meditate every day for 30 days straight? Meditation is a powerful habit for your mental, emotional, physical, spiritual health & wellness. Let’s build this daily habit together—Comment below if you’re in!

        // more guided meditations
        → 5 min morning meditation | https://bit.ly/3yaFyAP
        → 10 min meditation for positivity, gratitude & joy | https://bit.ly/3RKTlvk
        → 15 min guided meditation for anxiety & stress | https://bit.ly/2K112gr
        → 20 min guided meditation for positive energy, relaxation, peace | https://bit.ly/3kEJPH2
        → guided meditation for self love | https://bit.ly/3sGs2mn`,
    coverUrl: "/images/covers/mixer-1.png",
    url: "https://www.youtube.com/watch?v=H_uc-uQ3Nkc",
    duration: 3600,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: " Quiet Your Thoughts & Relax",
    category: "MIXER",
    introduction:
      `✨This 3-Day Online program can stop your overthinking and teach you to Master your Mind:
          https://satvicmovement.org/workshops/...

          I used to believe that overthinking and stress were going to be my lifelong friends, ones that wouldn't leave me even though I didn't want them. 😓

          However, after being introduced to yogic practices and philosophy, I bid these two "friends" goodbye in just a matter of months. 👋

          This meditation is designed to shift your awareness away from the chaos of life and toward a state of calm, peace, and centeredness. 😌

          Practice this every day, early in the morning and right before going to sleep, for the best experience. Do it on a light stomach, with earphones on, and in a quiet environment. 🧘🏻‍♂️

          Share your experiences with this meditation in the comments below! 👇🏼
          ____________________________________________

          📲 Stay Connected
          🔔 SUBSCRIBE to Satvic Yoga to continue receiving valuable Yoga wisdom -   / @satvicyoga   
          📸 Follow us on Instagram 
                Yoga knowledge -   / satvic.yoga  
                Food & lifestyle -    / satvicmovement  
          📲 Download the Satvic App (Available on Play Store & App Store): https://app.satvicmovement.org/join
          🌎  Visit our website: https://satvicmovement.org/`,
    coverUrl: "/images/covers/mixer-2.png",
    url: "https://www.youtube.com/watch?v=sfSDQRdIvTc",
    duration: 2700,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "Heal Your Heart & Release Emotions",
    category: "MIXER",
    introduction:
      `🌤 Download the audio for this guided meditation → https://lavendaire.com/10min-positivity

        Enjoy this 10 min meditation for positive energy, peace and light, including full body relaxation, visualization and positive affirmations. This is a good meditation for beginners and all levels. Use this as a daily morning meditation, or an evening meditation to cleanse your energy before sleep. 

        // guided meditations videos
        → 20 min guided meditation for positive energy, relaxation, peace | https://bit.ly/3kEJPH2
        → 15 min guided meditation for anxiety & stress | https://bit.ly/2K112gr
        → 5 min morning meditation | https://bit.ly/3yaFyAP
        → guided meditation for self love | https://bit.ly/3sGs2mn

        // positive affirmations videos
        → Positive Affirmations for Self Love, Self Esteem, Confidence | https://bit.ly/3B2zxZU
        → Powerful Morning Affirmations ☀️ | https://bit.ly/3A1lXqX`,
    coverUrl: "/images/covers/mixer-3.png",
    url: "https://www.youtube.com/watch?v=syx3a1_LeFo",
    duration: 2400,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Relaxing Full Body Yoga for Beginners",
    category: "MIXER",
    introduction:
      `✨This 3-Day Online program can stop your overthinking and teach you to Master your Mind:
          https://satvicmovement.org/workshops/...

          Welcome to Satvic Yoga, a space where you can reconnect with yourself. This is the first video in the 21 Day Yoga Camp series. I invite you to practice 1 video everyday for the next 21 days. My journey into Yoga started at the age of 28 when I got diagnosed with breast cancer. Throughout my treatment, I kept practicing, and it transformed my life. Today at 37, I'm the fittest I have ever been. I'm also calmer, more joyful and have beautiful relationships. This camp is an offering to all those who cannot step out of the home to practice yoga or don't get enough time to take care of themselves. Through these short and easy to follow videos, I hope you begin to care for yourself, improve your health and smile more often.

          #beginneryoga #bestonlineyoga #hindiyoga 
          ___________________________________________

          ▶️ Practice these videos also (highly recommended!): 
                1. Pranayama -    • Pranayama For Beginners | 10 mins to relea...  
                2. Yoga Nidra -    • Yoga Nidra : Deep Sleep is Just One Medita...  
          ____________________________________________

          📲 Stay Connected
          🔔 SUBSCRIBE to Satvic Yoga to continue receiving valuable Yoga wisdom -   / @satvicyoga   
          📸 Follow us on Instagram 
                Yoga knowledge -   / satvic.yoga  
                Food & lifestyle -    / satvicmovement  
          📲 Download the Satvic App (Available on Play Store & App Store): https://app.satvicmovement.org/join
          🌎  Visit our website: https://satvicmovement.org/`,
    coverUrl: "/images/covers/mixer-4.png",
    url: "https://www.youtube.com/watch?v=FdyhENXyIQ4&list=PLe1px9-uNQToJhrFIBpVsviZMABuLE5x8",
    duration: 3300,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "10-Minute Guided Meditation: Self-Love",
    category: "MIXER",
    introduction:
      `Join Manoj Dias, meditation teacher and co-founder and VP of Open, for a 10-minute guided meditation that prioritizes self-love.

        Visit the Open homepage: https://go.o-p-e-n.com/selfyt22
        Follow Open on Instagram:   / op_e___n  
        Find Manoj Dias on Instagram:   / manojdias_  


        Still haven’t subscribed to Self on YouTube? ►►  http://bit.ly/selfyoutubesub

        ABOUT SELF
        Daily health, fitness, beauty, style advice, and videos for people who want to achieve their personal best in life.`,
    coverUrl: "/images/covers/mixer-5.png",
    url: "https://www.youtube.com/watch?v=vj0JDwQLof4&t=1s",
    duration: 4200,
    author: "MindEase",
    sortOrder: 5,
  },
  {
    name: "Meditation Is Easier Than You Think",
    category: "MORNINGS",
    introduction:
      `FREE Course with Rinpoche: https://info.tergar.org/miniaam?utm_s...

        Feeling anxious, overwhelmed, or like something's missing? You're not alone.

        This free 3-day meditation journey with Mingyur Rinpoche shows you how to work with anxiety, overthinking, and stress using simple awareness practices that fit into real life. 

        No apps. No jargon. No long sitting sessions.

        Start for free → 
        https://info.tergar.org/miniaam?utm_s...`,
    coverUrl: "/images/covers/m1.png",
    url: "https://www.youtube.com/watch?v=thcEuMDWxoI",
    duration: 720,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: "10 Minute Morning Meditation - You'll Have the Most Incredible Day",
    category: "MORNINGS",
    introduction:
      `Listen to this 10-minute guided morning meditation to start your day well, and you'll have the most incredible day today. Attract positive energy and welcome gratitude, awakening your intentions for daily greatness.

        Best Morning Meditations:    • The Best Morning Meditations ☀️  

        Start your day right with our 10-minute morning meditation, designed to give you the most incredible day! Whether you wake up early or need a calm start to your routine, this video is perfect for beginners and experienced practitioners alike. Discover how to integrate mindfulness into your daily routine and wake up feeling refreshed and centered.

        In this guided meditation, you'll learn the best techniques to begin your day with a clear headspace and a sense of calm. We'll explore the benefits of a morning meditation practice and provide you with free ideas on how to do it effectively. Wondering how long you should meditate? Our 10-minute session is the ideal length to fit into any busy schedule.

        We'll show you how to create a routine that incorporates mindfulness from the moment you wake up. This video includes a guided reading to help you get started, making it easy for beginners to dive in. Don't miss out on the incredible benefits of starting your day with meditation.

        Hit play and let’s begin your journey to a more mindful and peaceful morning. Remember to subscribe for more daily meditation ideas and routines. Let's make waking up the best part of your day!

        Thank you for listening to this guided meditation, and I wish you the best day ever!`,
    coverUrl: "/images/covers/m2.png",
    url: "https://www.youtube.com/watch?v=qQ4vD5FdOKM",
    duration: 600,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "5 Min Meditation Anyone Can Do Anywhere | Re-Center & Clear Your Mind",
    category: "MORNINGS",
    introduction:
      `This five minute guided meditation is the best way to quickly and effectively find peace, recenter yourself, and clear your mind for anything. It's a perfect tool because the most common internal resistance we all share that works against a consistent meditation practice, is time. But who doesn't have 5 minutes? 

      🚨 Check out our NEW YouTube channel dedicated EXCLUSIVELY to Meditations 🚨 

      Instructor: Juliana Spicoluk
      Location: Canada

      ※ ※ ※ ※ ※

      ➤ The Boho Beautiful App
      A complete wellness studio in your pocket.

      https://www.bohobeautiful.app
      No Credit Card Needed, No Free Trial - Just Download & Press Play 

      Apple Store 📱 
      https://apps.apple.com/us/app/boho-be... 

      Android Store  🖥 
      https://play.google.com/store/apps/de... 

      The Most Authentic Content For The Most Powerful Results`,
    coverUrl: "/images/covers/m3.png",
    url: "https://www.youtube.com/watch?v=LDs7jglje_U",
    duration: 840,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Soothing Breathwork Meditation",
    category: "MORNINGS",
    introduction:
      `🫧 During this meditation, we move through the 4–7–8 breathing pattern together. 

        stay connected:   / a.zen.mind  

        This particular breathing pattern is proven to help shift the body out of survival mode and into a more relaxed and calm state of peace and ease. 
        This is a moderate guidance meditation, meaning you’ll have space to breathe at your own pace, with gentle cues to keep you grounded and on track.

        This practice is soothing, spacious, and deeply healing for the mind, body, and soul, created to help you release stress, anxiety, or overwhelm, and gently guide you back to yourself.`,
    coverUrl: "/images/covers/m4.png",
    url: "https://www.youtube.com/watch?v=Xw52flWo6-M&list=PLSCtKorB3pjGvw75CHlCtBesHF74Zgn7K",
    duration: 1080,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "Rewire for Success, Love, & Abundance",
    category: "SLEEP",
    introduction:
      `⛰️We are all deeply worthy of the life we desire. This meditation will guide you into the space where you can feel it, believe it, and claim it. 

        Instagram:   / a.zen.mind  

        Success, health, abundance, love, all of it is available to us. Yet so often, we find ourselves caught in pushing, forcing, and striving. These patterns keep us in a state of survival, and disconnected from our ability to receive.

        This meditation brings you back to your core, reminding you that you are worthy of a beautiful and fulfilling life, without needing to prove or earn it.

        This is an active meditation, where we move through reflective questions and affirmations, while creating space to truly feel and experience the positivity that you are calling into your future.`,
    coverUrl: "/images/covers/m5.png",
    url: "https://www.youtube.com/watch?v=oX5bHgCN714&list=PLSCtKorB3pjGvw75CHlCtBesHF74Zgn7K&index=2",
    duration: 1500,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: "Guided Sleep Meditation & Deep Relaxation",
    category: "SLEEP",
    introduction:
      `🌙 Download the free audio for this guided sleep meditation → http://lavendaire.com/sleep-meditation

        A 20 minute guided meditation & talk down (female voice) for sleep & deep relaxation, with breathing exercises and gentle stretching to release tension and stress from your body and mind. Calm your mind, fall asleep fast, & sleep better with this meditation that's great for beginners & all levels. 

        // more meditation videos
        → 20 min guided meditation for positive energy, relaxation, peace | https://bit.ly/3kEJPH2
        → 15 min guided meditation for anxiety & stress | https://bit.ly/2K112gr
        → guided meditation for self love | https://bit.ly/3sGs2mn
        → 5 minute guided morning meditation | https://bit.ly/3jsehpJ`,
    coverUrl: "/images/covers/s1.png",
    url: "https://www.youtube.com/watch?v=rvaqPPjtxng",
    duration: 1800,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "Fall Asleep In MINUTES! Sleep Talk-Down Guided Meditation Hypnosis for Sleeping",
    category: "SLEEP",
    introduction:
      `A beautiful guided sleep meditation that will have you falling asleep in minutes! This is a sleep talk down hypnosis to help you release the day behind you and to fall asleep. 

        Transform your life with my free meditations – unlock peace, healing, and sleep like never before. Download now https://jasonstephenson.net/lp/free-r...

        Get more great sleep - Subscribe    / @jasonstephensonmeditation  

        Presave my latest audio on your favourite platform
        https://unitedmasters.com/a/jasonstep...

        Listen to more meditation and music:
        Spotify: https://open.spotify.com/artist/1DbGU...
        Apple Music:   / jason-stephenson  
        Insight Timer: https://insighttimer.com/jasonstephenson
        YouTube Music:      / jason stephenson - topic  
        Amazon Music: https://music.amazon.com/artists/B001...
        Deezer: https://www.deezer.com/en/artist/4994599`,
    coverUrl: "/images/covers/s2.png",
    url: "https://www.youtube.com/watch?v=U6Ay9v7gK9w",
    duration: 2100,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Full-Body Relaxation and Guided Breathing Meditation | for Bone Deep Sleep – Rest and Restore",
    category: "SLEEP",
    introduction:
      `If you watch any YouTube video as part of a playlist or ‘mix’, YouTube overrides your autoplay settings and automatically plays a video after the one you’re watching even if you have autoplay switched off. 
      To get around this you can watch it here:    • Full-Body Relaxation and Guided Breathing ...   or click 'share' below the video and copy the link to a new window....
      this will not autoplay another video...and protect your sleep!
      (make sure autoplay is also off – there’s an autoplay button at the bottom of the video from a laptop or in ‘settings’ on the mobile app.)
      _____________________________________

      In this meditation we’ll be using breathing to trigger the parasympathetic nervous system (rest and repair mode) helping your body to get a proper night’s rest. 



      Ingrained muscle tension and shallow breathing habits can prevent your body from fully switching off from a nervous system 'stress response'. This has an impact on virtually every system in the body. 

      By taking the time to release muscle tension, breathe deeply before sleep you’re helping your body restore -- by providing the internal conditions your body needs for a healthy immune system, digestive system, helping to regulate blood pressure, blood sugar levels as well as support the repair and function of every organ and system in the body. 



      What if you meditate and you still can’t sleep!?...
      Even if you don’t find that you’re able to get as much sleep as you’d like, simply by meditating you’re changing your inner chemistry in the form of hormones and neurotransmitters…


      Less sleep in repair mode can leave you feeling more rested than lots of sleep in stress mode!

      So if you suffer from insomnia relax, knowing you’re doing something great for your body simply by meditating, from your skin to your bones and everything in between. `,
    coverUrl: "/images/covers/s3.png",
    url: "https://www.youtube.com/watch?v=a1j2Uhzc08s",
    duration: 2400,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "Deep Sleep Hypnosis, Guided Sleep Meditation",
    category: "SLEEP",
    introduction:
      `Welcome to this Deep Sleep Hypnosis, Guided Sleep Meditation. This session is designed to help you fall asleep faster, sleep more deeply, and wake up feeling restored.

      We’ll begin by soothing the body with gentle breathwork, gradually releasing tension as you drift deeper into stillness. We’ll then use affirmations and hypnotic cues to reinforce a deep sense of peace—helping you let go of stress and surrender to effortless rest.

      Intro – 0:00
      Guided Hypnosis Begins – 2:28
      Affirmations Begin – ~33:56

      This sleep hypnosis is especially helpful if you’re feeling depleted, burnt out, or mentally exhausted. As you listen, your subconscious mind will absorb every suggestion for calm, renewal, and deep restoration—supporting you as your body and mind recharge overnight.

      For best results, listen for seven nights in a row. Let go, unwind, and experience deep, rejuvenating Sleep.

      💤 Press play and let your deepest rest begin.`,
    coverUrl: "/images/covers/s4.png",
    url: "https://www.youtube.com/watch?v=hwNb49-ofzI",
    duration: 2700,
    author: "MindEase",
    sortOrder: 5,
  },
] as const satisfies readonly CategoryLibrarySeedItem[];

const SPOTLIGHT_ITEMS = [
  {
    title: "Daily Calm",
    description:
      "Tamara Levitt guides this 10 minute Daily Calm mindfulness meditation to powerfully restore and re-connect with the present.",
    author: "MindEase Guide",
    coverUrl: "/cover/DailyCalm.png",
    mediaUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
    duration: 720,
    rating: 4.9,
    playCount: 12400,
    sortOrder: 0,
    tags: ["Empowerment", "Breath", "Focus"],
  },
  {
    title: "10-Minute Guided Meditation: Self-Love",
    description:
      `Join Manoj Dias, meditation teacher and co-founder and VP of Open, for a 10-minute guided meditation that prioritizes self-love.

        Visit the Open homepage: https://go.o-p-e-n.com/selfyt22
        Follow Open on Instagram:   / op_e___n  
        Find Manoj Dias on Instagram:   / manojdias_  


        Still haven’t subscribed to Self on YouTube? ►►  http://bit.ly/selfyoutubesub

        ABOUT SELF
        Daily health, fitness, beauty, style advice, and videos for people who want to achieve their personal best in life.`,
    author: "Sora Lin",
    coverUrl: "/cover/Self-Love.png",
    mediaUrl: "https://www.youtube.com/watch?v=vj0JDwQLof4",
    duration: 600,
    rating: 4.8,
    playCount: 9800,
    sortOrder: 1,
    tags: ["Nature", "Calm", "Morning"],
  },
  {
    title: "Mindfulness Meditation",
    description:
      `Take care of yourself with Calm. → https://cal.mn/40off

      Tamara Levitt guides this 10 Minute Mindfulness Meditation.

      A daily meditation practice helps with lessening anxiety, worry and stress, while enhancing self-esteem and self-acceptance. It also improves resilience against uncertainty and adversity.

      There’s loads of of scientifically proven meditation benefits including improving mental strength, focus, better decision-making and problem solving - all of which are paramount to achieving success on the entrepreneurial journey.

      Join us for this Daily Calm meditation on the power of being present. The Daily Calm is a unique mix of meditation and inspiration everyday released on our iOS and Android app.`,
    author: "MindEase Studio",
    coverUrl: "/cover/Mindfulness.png",
    mediaUrl: "https://www.youtube.com/watch?v=lVx3mFxML80",
    duration: 540,
    rating: 4.85,
    playCount: 7600,
    sortOrder: 2,
    tags: ["Stillness", "Release", "Evening"],
  },
  {
    title: "Guided Meditation For Reprogramming Your Mind",
    description:
      `Welcome to SHOW's Guided Meditation, the best-guided meditation experience on YouTube! 🧘‍♂️ If you're ready to relax, find inner peace, and manifest your desires, you're in the right place. Make yourself comfortable and sit up straight, ensuring you're free from any discomfort.

        In this meditation session, we'll guide you through a journey of self-awareness, gratitude, forgiveness, and manifestation. It's time to unlock your full potential and transform your reality.

        Here's a glimpse of what you'll experience:
        Begin by taking three deep breaths—inhale through your nose and exhale through your mouth. Feel the air nourishing your body as you release any tension.
        Shift your focus to your body. Become aware of every sensation, from the top of your head to your toes. We'll gently guide you through a body scan, helping you connect with yourself.
        Visualize and expand your energy, like a radiant light or a warm fire, starting from your forehead. Give this energy a color and let it fill your surroundings, embracing you in its warmth.
        Reflect on your day or yesterday and express gratitude for the small and big things in your life. Take a moment to visualize what you're thankful for.
        Imagine someone who has caused you distress, forgive them to free yourself from resentment. Then, forgive yourself for any self-sabotage, allowing inner peace to take over.
        Focus on one thing you desire the most. Dive deep into the emotions and sensations associated with having it. Let your imagination run wild as you experience it as if it's already yours.
        As you return to the present moment, take a few deep breaths, stretch your body, and open your eyes. Carry the positive energy of this meditation with you into your day or night.

        Remember, this meditation can be revisited whenever you need to relax, reset, or manifest your dreams. If you found this meditation valuable, please like, share, and subscribe for more guided meditations and self-improvement content.`,
    author: "MindEase Studio",
    coverUrl: "/cover/4.png",
    mediaUrl: "https://www.youtube.com/watch?v=tqhxMUm7XXU",
    duration: 360,
    rating: 4.7,
    playCount: 2100,
    sortOrder: 3,
    tags: ["Mind", "Reprogramming", "Release"],
  },
] as const;

const MADE_FOR_YOU_ITEMS = [
  {
    title: "20 Minute Guided Meditation For The Heart",
    description:
      `Listen to this 20 minute guided meditation each day and explore the love and compassion within our hearts to find a state of relaxation and inner peace. 
      🚨 Check out our NEW youtube channel dedicated EXCLUSIVELY to Meditations 🚨 
      @BohoBeautifulMeditation
      By letting go of any negative, stagnant energy and focusing on the light and love within us, we will find protection from any external disturbances. Using our breath as an anchor in this present moment. 

      We will hold space for any emotions that have been holding us back, observing them with compassion and kindness and letting them go, allowing space for positivity and grounding. Finding deep clarity and sense of connection, and remembering that we are the light.

      Mantra: Through love, I return home to my heart. I am loved, supported and guided.

      Enjoy this moment of mindfulness.

      Instructor: Juliana Spicoluk
      Location: Vancouver Island 🇨🇦`,
    author: "For you",
    coverUrl: "/cover/Heart.png",
    mediaUrl: "https://www.youtube.com/watch?v=TPC_36ZHOjo",
    duration: 300,
    rating: 4.7,
    playCount: 4200,
    sortOrder: 0,
    tags: ["Short", "Ocean", "Reset"],
  },
  {
    title: "Meditation For Inner Peace",
    description:
      `Dive into meditation this Spring, go inward to focus on what feels good in mind and body. Want to have a good body? Tend to the mind. This 10 min practice is a simple meditation that will create the foundation for transformational practice. Compliment your yoga asana practice with this 10 Min Meditation For Inner Peace.

      Let me know how it goes down below and share it with your people!

      Breathe. Namaste.

      - - - - - - - - - 

      ❤️ WELCOME to the Yoga With Adriene YouTube channel! Our mission is to connect as many people as possible through high-quality free yoga videos. We welcome all levels, all bodies, all genders, all souls! SUBSCRIBE  to the channel and join our global movement! ❤️`,
    author: "For you",
    coverUrl: "/cover/Inner Peace.png",
    mediaUrl: "https://www.youtube.com/watch?v=d4S4twjeWTs",
    duration: 360,
    rating: 4.75,
    playCount: 3100,
    sortOrder: 1,
    tags: ["Rain", "Focus", "Loop"],
  },
  {
    title: "10-Minute Meditation For Sleep",
    description:
      `If you are feeling restless, listen to this guided meditation to ease your mind and body into falling asleep. 

        Written and Narrated by John Davisi. John is a mindfulness life coach, teacher, and speaker.
        Check out all of his mindfulness and meditation sessions at https://www.johndavisi.com

        Find John Davisi on Social Media:
        Youtube:    / johndavisi  
        Instagram & Twitter: @johndavisi

        Subscribe to Goodful: https://bzfd.it/2QApoPk

        About Goodful:
        Feel better, be better, and do better. Subscribe to Goodful for all your healthy self care needs, from food to fitness and everything in between!`,
    author: "For you",
    coverUrl: "/cover/3.jpg",
    mediaUrl: "https://www.youtube.com/watch?v=aEqlQvczMJQ",
    duration: 420,
    rating: 4.8,
    playCount: 2800,
    sortOrder: 2,
    tags: ["Sleep", "Bowl", "Drift"],
  },
  {
    title: "A Guided Meditation on the Body",
    description:
      `This gentle 10-minute guided meditation is designed to help you release the day before sleep.

        If your mind feels busy, heavy, or overstimulated at night, this meditation offers a calm, supportive space to let go — without needing to fix or figure anything out.

        ⚠️ My meditations are for relaxation and personal support only. Please do not listen to while driving or operating machinery. They are not a substitute for medical or mental health treatment. 
        Always seek advice from a qualified healthcare professional if needed. 

        🌿 Explore deeper practices on my YouTube channel: Lisa Martin Meditations.

        🔔 Subscribe -    / @lisamartinmeditations  

        🎧 Best enjoyed with headphones`,
    author: "For you",
    coverUrl: "/cover/body.png",
    mediaUrl: "https://www.youtube.com/watch?v=TR11LU9ziCU",
    duration: 480,
    rating: 4.6,
    playCount: 1900,
    sortOrder: 3,
    tags: ["Noise", "Shelter", "Night"],
  },
  {
    title: "Guided Morning Meditation ",
    description:
      `Listen to this guided meditation every morning and set your day and mind up with the perfect kick start. 

        This 10 minute mindful meditation will give you the mental clarity and space necessary to ground yourself with beautiful focus and set your day on the perfect track for success and fulfillment. 

        Finding a quiet space to sit in peace, stillness, and with yourself to meditate can easily be one of the most beneficial gifts we can give to ourselves. A regular practice can shift the way you feel, the energy in your body, and your entire human day to day experience. 

        🚨 Check out our NEW Youtube Channel dedicated EXCLUSIVELY to Meditations 🚨 
        @BohoBeautifulMeditation

        May you find exactly what you need.
        Enjoy!

        *
        Boho Beautiful is Juliana Spicoluk & Mark Spicoluk`,
    author: "For you",
    coverUrl: "/cover/morning.png",
    mediaUrl: "https://www.youtube.com/watch?v=FGO8IWiusJo",
    duration: 300,
    rating: 4.72,
    playCount: 1500,
    sortOrder: 4,
    tags: ["Sunday", "Stillness"],
  },
  {
    title: "Powerful Guided Meditation",
    description:
      `A 10 minute guided meditation for healing, letting go, and inner peace. Heal your heart & emotional wounds with positive energy visualization, energy healing heart chakra tapping, and positive affirmations. This healing meditation will help you cultivate gratitude, self forgiveness, and perspective for your journey. Great for beginners and all levels.

      🤍 Download the audio for this guided meditation → https://lavendaire.com/healing-medita...

      // more meditation videos
      → 20 min guided meditation for positive energy, relaxation, peace | https://bit.ly/3kEJPH2
      → 15 min guided meditation for anxiety & stress | https://bit.ly/2K112gr
      → guided meditation for self love | https://bit.ly/3sGs2mn
      → 5 minute guided morning meditation | https://bit.ly/3jsehpJ`,
    author: "For you",
    coverUrl: "/cover/Powerful.png",
    mediaUrl: "https://www.youtube.com/watch?v=vtOAnC73xtk",
    duration: 360,
    rating: 4.78,
    playCount: 2200,
    sortOrder: 5,
    tags: ["Night", "Grounding"],
  },
] as const;

function resolveProjectRef(): string {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const host = new URL(supabaseUrl).hostname;
      const ref = host.split(".")[0];
      if (ref) return ref;
    } catch {
      // fall through
    }
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const host = new URL(databaseUrl).hostname;
      const match = host.match(/^postgres\.([^.]+)\./);
      if (match?.[1]) return match[1];
    } catch {
      // fall through
    }
  }

  return "skfogwhzqooyqtifdouv";
}

function assetUrl(filename: string): string {
  const projectRef = resolveProjectRef();
  return `https://${projectRef}.supabase.co/storage/v1/object/public/${BUCKET}/${filename}`;
}

/** Pass through YouTube/external URLs; only map bare paths to Supabase Storage. */
function resolveStreamingMediaUrl(source: string): string {
  if (/^https?:\/\//i.test(source)) {
    return source;
  }
  return assetUrl(source);
}

async function seedAmbientTracks(): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const track of AMBIENT_TRACKS) {
    const existing = await prisma.meditationAudio.findFirst({
      where: { name: track.name },
    });

    const url = assetUrl(track.filename);

    if (existing) {
      await prisma.meditationAudio.update({
        where: { id: existing.id },
        data: { url, category: track.category },
      });
      console.log(`  update ambient: ${track.name}`);
      updated++;
      continue;
    }

    await prisma.meditationAudio.create({
      data: {
        name: track.name,
        url,
        category: track.category,
        duration: null,
      },
    });
    console.log(`  create ambient: ${track.name}`);
    created++;
  }

  return { created, updated };
}

async function seedCourse(): Promise<"created" | "updated"> {
  let course = await prisma.course.findFirst({
    where: {
      OR: [{ title: COURSE_TITLE }, { title: LEGACY_COURSE_TITLE }],
    },
    include: { steps: { orderBy: { daySequence: "asc" } } },
  });

  if (!course) {
    await prisma.course.create({
      data: {
        title: COURSE_TITLE,
        description:
          "A beginner-friendly 3-day introduction to mindfulness. Complete each day to unlock the next.",
        steps: {
          create: COURSE_STEPS.map((step) => ({
            daySequence: step.daySequence,
            title: step.title,
            audio: {
              create: {
                name: step.audioName,
                url: assetUrl(step.guideFile),
                bgVideoUrl: step.loopFile ? assetUrl(step.loopFile) : null,
                category: "course",
                duration: 480,
              },
            },
          })),
        },
      },
    });
    console.log(`  create course: ${COURSE_TITLE} (3 steps)`);
    return "created";
  }

  if (course.title !== COURSE_TITLE) {
    course = await prisma.course.update({
      where: { id: course.id },
      data: { title: COURSE_TITLE },
      include: { steps: { orderBy: { daySequence: "asc" } } },
    });
  }

  await prisma.course.update({
    where: { id: course.id },
    data: {
      description:
        "A beginner-friendly 3-day introduction to mindfulness. Complete each day to unlock the next.",
    },
  });

  for (const stepDef of COURSE_STEPS) {
    const existingStep = course.steps.find(
      (s) => s.daySequence === stepDef.daySequence
    );

    if (existingStep) {
      await prisma.courseStep.update({
        where: { id: existingStep.id },
        data: { title: stepDef.title },
      });
      await prisma.meditationAudio.update({
        where: { id: existingStep.audioId },
        data: {
          name: stepDef.audioName,
          url: assetUrl(stepDef.guideFile),
          bgVideoUrl: stepDef.loopFile ? assetUrl(stepDef.loopFile) : null,
          category: "course",
          duration: 480,
        },
      });
      console.log(`  update step ${stepDef.daySequence}: ${stepDef.title}`);
    } else {
      const audio = await prisma.meditationAudio.create({
        data: {
          name: stepDef.audioName,
          url: assetUrl(stepDef.guideFile),
          bgVideoUrl: stepDef.loopFile ? assetUrl(stepDef.loopFile) : null,
          category: "course",
          duration: 480,
        },
      });
      await prisma.courseStep.create({
        data: {
          courseId: course.id,
          daySequence: stepDef.daySequence,
          title: stepDef.title,
          audioId: audio.id,
        },
      });
      console.log(`  create step ${stepDef.daySequence}: ${stepDef.title}`);
    }
  }

  console.log(`  update course: ${COURSE_TITLE}`);
  return "updated";
}

async function seedDailyZen(): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const theme of DAILY_ZEN_THEMES) {
    const existing = await prisma.meditationAudio.findFirst({
      where: { name: theme.name },
    });

    const guideFile = DAILY_GUIDE_FILES[theme.weekdayIndex];
    const data = {
      name: theme.name,
      url: assetUrl(guideFile),
      bgVideoUrl: null,
      category: "daily",
      duration: theme.duration,
    };

    if (existing) {
      await prisma.meditationAudio.update({
        where: { id: existing.id },
        data,
      });
      console.log(`  update daily: ${theme.theme}`);
      updated++;
    } else {
      await prisma.meditationAudio.create({ data });
      console.log(`  create daily: ${theme.theme}`);
      created++;
    }
  }

  return { created, updated };
}

function publicCoverExists(coverUrl: string | null | undefined): boolean {
  const trimmed = coverUrl?.trim();
  if (!trimmed) return false;
  const relative = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

/** Drop library rows not in seed, missing cover file, or empty coverUrl. */
async function cleanupCategoryLibrary(): Promise<number> {
  const seedNamesByCategory = new Map<string, Set<string>>();
  for (const item of CATEGORY_LIBRARY_SEED) {
    if (
      !(LIBRARY_CATEGORIES as readonly string[]).includes(item.category)
    ) {
      continue;
    }
    if (!seedNamesByCategory.has(item.category)) {
      seedNamesByCategory.set(item.category, new Set());
    }
    seedNamesByCategory.get(item.category)!.add(item.name);
  }

  const libraryRows = await prisma.meditationAudio.findMany({
    where: { category: { in: [...LIBRARY_CATEGORIES] } },
    select: { id: true, name: true, category: true, coverUrl: true },
  });

  let removed = 0;
  for (const row of libraryRows) {
    const inSeed = seedNamesByCategory.get(row.category)?.has(row.name) ?? false;
    const hasCover = publicCoverExists(row.coverUrl);
    if (!inSeed || !hasCover) {
      await prisma.meditationAudio.delete({ where: { id: row.id } });
      const reason = !inSeed ? "not in seed" : "blank or missing cover";
      console.log(`  remove library [${row.category}]: ${row.name} (${reason})`);
      removed++;
    }
  }

  return removed;
}

async function seedCategoryLibrary(): Promise<{
  created: number;
  updated: number;
  removed: number;
}> {
  let created = 0;
  let updated = 0;

  const legacyTimer = await prisma.meditationAudio.deleteMany({
    where: { category: "TIMER" },
  });
  if (legacyTimer.count > 0) {
    console.log(`  remove legacy TIMER library: ${legacyTimer.count} rows`);
  }

  const cleaned = await cleanupCategoryLibrary();

  for (const item of CATEGORY_LIBRARY_SEED) {
    const existing = await prisma.meditationAudio.findFirst({
      where: { name: item.name, category: item.category },
    });

    const data = {
      name: item.name,
      url: item.url,
      bgVideoUrl: null,
      category: item.category,
      introduction: item.introduction,
      // Keep cover images as local public paths (e.g. "/images/covers/mixer-1.png")
      // so the app loads them from `public/` without relying on Supabase Storage.
      coverUrl: item.coverUrl,
      author: item.author,
      sortOrder: item.sortOrder,
      published: true,
      duration: item.duration,
    };

    if (existing) {
      await prisma.meditationAudio.update({
        where: { id: existing.id },
        data,
      });
      console.log(`  update library [${item.category}]: ${item.name}`);
      updated++;
    } else {
      await prisma.meditationAudio.create({ data });
      console.log(`  create library [${item.category}]: ${item.name}`);
      created++;
    }
  }

  return { created, updated, removed: legacyTimer.count + cleaned };
}

const STREAMING_SECTIONS = ["SPOTLIGHT", "MADE_FOR_YOU"] as const;

/** Remove spotlight / made-for-you rows that are no longer in seed. */
async function cleanupStreamingCatalog(): Promise<number> {
  const seedTitlesBySection = new Map<string, Set<string>>([
    ["SPOTLIGHT", new Set(SPOTLIGHT_ITEMS.map((item) => item.title))],
    ["MADE_FOR_YOU", new Set(MADE_FOR_YOU_ITEMS.map((item) => item.title))],
  ]);

  const rows = await prisma.streamingItem.findMany({
    where: { sectionType: { in: [...STREAMING_SECTIONS] } },
    select: { id: true, title: true, sectionType: true, coverUrl: true },
  });

  let removed = 0;
  for (const row of rows) {
    const inSeed =
      seedTitlesBySection.get(row.sectionType)?.has(row.title) ?? false;
    const hasCover = publicCoverExists(row.coverUrl);
    if (!inSeed || !hasCover) {
      await prisma.streamingItem.delete({ where: { id: row.id } });
      const reason = !inSeed ? "not in seed" : "missing cover file";
      console.log(
        `  remove streaming [${row.sectionType}]: ${row.title} (${reason})`
      );
      removed++;
    }
  }

  return removed;
}

async function seedStreamingItems(): Promise<{
  spotlight: number;
  madeForYou: number;
  removed: number;
}> {
  let spotlight = 0;
  let madeForYou = 0;

  const removed = await cleanupStreamingCatalog();

  for (const item of SPOTLIGHT_ITEMS) {
    const existing = await prisma.streamingItem.findFirst({
      where: { sectionType: "SPOTLIGHT", title: item.title },
    });
    const data = {
      sectionType: "SPOTLIGHT",
      title: item.title,
      description: item.description,
      videoUrl: resolveStreamingMediaUrl(item.mediaUrl),
      coverUrl: item.coverUrl,
      duration: item.duration,
      rating: item.rating,
      playCount: item.playCount,
      author: item.author,
      tags: item.tags.join(","),
      sortOrder: item.sortOrder,
      published: true,
    };
    if (existing) {
      await prisma.streamingItem.update({ where: { id: existing.id }, data });
      console.log(`  update spotlight: ${item.title}`);
    } else {
      await prisma.streamingItem.create({ data });
      console.log(`  create spotlight: ${item.title}`);
      spotlight++;
    }
  }

  for (const item of MADE_FOR_YOU_ITEMS) {
    const existing = await prisma.streamingItem.findFirst({
      where: { sectionType: "MADE_FOR_YOU", title: item.title },
    });
    const data = {
      sectionType: "MADE_FOR_YOU",
      title: item.title,
      description: item.description,
      videoUrl: resolveStreamingMediaUrl(item.mediaUrl),
      coverUrl: item.coverUrl,
      duration: item.duration,
      rating: item.rating,
      playCount: item.playCount,
      author: item.author,
      tags: item.tags.join(","),
      sortOrder: item.sortOrder,
      published: true,
    };
    if (existing) {
      await prisma.streamingItem.update({ where: { id: existing.id }, data });
      console.log(`  update made for you: ${item.title}`);
    } else {
      await prisma.streamingItem.create({ data });
      console.log(`  create made for you: ${item.title}`);
      madeForYou++;
    }
  }

  return { spotlight, madeForYou, removed };
}

async function main() {
  console.log("Seeding MindEase MVP data...\n");

  console.log("Ambient tracks (Zen Timer):");
  const ambient = await seedAmbientTracks();

  console.log("\nStructured course:");
  const course = await seedCourse();

  console.log("\nDaily Zen themes:");
  const daily = await seedDailyZen();

  console.log("\nCategory libraries (MIXER / MORNINGS / SLEEP):");
  const library = await seedCategoryLibrary();

  console.log("\nStreaming catalog (Spotlight + Made For You):");
  const streaming = await seedStreamingItems();

  console.log("\nDone.");
  console.log(
    `  Ambient: ${ambient.created} created, ${ambient.updated} updated`
  );
  console.log(`  Course: ${course}`);
  console.log(
    `  Daily Zen: ${daily.created} created, ${daily.updated} updated`
  );
  console.log(
    `  Category library: ${library.created} created, ${library.updated} updated, ${library.removed} removed`
  );
  console.log(
    `  Streaming: ${streaming.spotlight} spotlight created, ${streaming.madeForYou} made-for-you created, ${streaming.removed} removed`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
