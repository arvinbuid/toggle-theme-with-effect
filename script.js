let styleElement = document.createElement("style");
document.head.appendChild(styleElement);

let activeButton = null;
let currentTheme = "light"; // Assuming 'light' is the default theme

const injectCSS = (css) => {
  styleElement.textContent = css;
};

const switchTheme = (button, animation) => {
  const newTheme = currentTheme === "light" ? "dark" : "light";
  button.setAttribute("aria-pressed", newTheme === "dark");
  document.documentElement.className = newTheme;
  currentTheme = newTheme;
  injectCSS(animation.css);
};

const updateButtonStates = () => {
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    if (btn === activeButton) {
      btn.disabled = false;
      btn.setAttribute("aria-pressed", currentTheme === "dark");
    } else {
      btn.disabled = currentTheme === "dark";
      btn.setAttribute("aria-pressed", "false");
    }
  });
};

const toggleTheme = (button, animation) => {
  if (activeButton && activeButton !== button) {
    return; // If there's an active button and it's not this one, do nothing
  }

  if (!document.startViewTransition) {
    switchTheme(button, animation);
    activeButton = currentTheme === "dark" ? button : null;
    updateButtonStates();
  } else {
    const transition = document.startViewTransition(() => {
      switchTheme(button, animation);
      activeButton = currentTheme === "dark" ? button : null;
    });
    transition.finished.then(() => {
      updateButtonStates();
    });
  }
};

const getAnimationByName = (name) => {
  return animations.find((animation) => animation.name === name);
};

// Event delegation on the document body
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("theme-toggle") && !event.target.disabled) {
    const animationName = event.target.dataset.animation;
    const animation = getAnimationByName(animationName);

    if (animation) {
      toggleTheme(event.target, animation);
    } else {
      console.warn(`Animation "${animationName}" not found for button:`, event.target);
    }
  }
});

// Initial button state setup
updateButtonStates();
