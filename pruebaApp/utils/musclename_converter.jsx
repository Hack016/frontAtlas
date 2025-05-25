export const getConventionalName = (name) => {
  switch (name) {
    case "Anterior deltoid":
      return "Deltoid";
    case "Biceps brachii":
      return "Biceps";
    case "Biceps femoris":
      return "Hamstring";
    case "Brachialis":
      return "Brachialis";
    case "Gastrocnemius":
      return "Calf";
    case "Gluteus maximus":
      return "Glutes";
    case "Latissimus dorsi":
      return "Lats";
    case "Obliquus externus abdominis":
      return "Obliques";
    case "Pectoralis major":
      return "Chest";
    case "Quadriceps femoris":
      return "Quads";
    case "Rectus abdominis":
      return "Abs";
    case "Serratus anterior":
      return "Back";
    case "Soleus":
      return "Soleus";
    case "Trapezius":
      return "Traps";
    case "Triceps brachii":
      return "Triceps";
    default:
      return name;
  }
};

export const getLatinName = (name) => {
  switch (name) {
    case "Front deltoid":
      return "Anterior deltoid";
    case "Biceps":
      return "Biceps brachii";
    case "Hamstring":
      return "Biceps femoris";
    case "Brachialis":
      return "Brachialis";
    case "Calf":
      return "Gastrocnemius";
    case "Glutes":
      return "Gluteus maximus";
    case "Lats":
      return "Latissimus dorsi";
    case "External obliques":
      return "Obliquus externus abdominis";
    case "Chest":
      return "Pectoralis major";
    case "Quads":
      return "Quadriceps femoris";
    case "Abs":
      return "Rectus abdominis";
    case "Serratus":
      return "Serratus anterior";
    case "Soleus":
      return "Soleus";
    case "Traps":
      return "Trapezius";
    case "Triceps":
      return "Triceps brachii";
    default:
      return name;
  }
};
