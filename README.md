**TRY THE LIVE VERSION!**
https://engaging-computing.github.io/AI-for-ASL/SignInterpreter/src/

# AI-for-ASL

Demonstrating how AI can recognize American Sign Language hand signs.

### About
AI for American Sign Language (AI for ASL) was developed so that participants could learn about Artificial Intelligence through hands-on interaction.  The project also lets users to learn about American Sign Language (ASL), a language that allows people to communicate through hand signals. 

We wanted a simple application that sparks curiosity and understanding of AI and machine learning (ML). In AI for ASL, the user signs ASL characters into a camera and the application attempts to accurately interpret the hand signs. 

We created two models, *Blue* and *Red*, that are each trained to recognize five characters. The Blue model was trained to recognize the characters **a, b, c, d,** and **l**. The Red model was trained to recognize **d, e, f, g,** and **i**. By having two models, we introduce the idea that AI needs to be specifically trained to complete certain tasks. The Blue model cannot recognize all characters in the Red model, and vice versa.

We hope to provide a practical (and fun) introduction to artificial intelligence and machine learning. Please feel free to incorporate our app in your AI and ML curriculum!

Originally created by James Dimino and Andrew Farrell, extended by Angela Wang and Ryan Maradiaga, coordinated by Fred Martin.

### Getting Started

To run the sign interpreter, start by cloning the repository with `git clone {repo url}`. From there, navigate to the `src` directory and open the `index.html` file in a modern browser. Alternatively, you can open the file in Visual Studio code and use the "GoLive" extension.

### What is it?

The project uses p5.js and ml5.js to host an interactive sign language interpreter. The interpreter uses live video to capture frames and then predict which signs are being shown in the frame! The project is meant to expose individuals to machine learning as well as ASL.

### Limitations

Currently, the model is trained only on letters A-I. We plan to expand the letters and experience options in the future!
