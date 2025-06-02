export const mapMuscleToGroup = (muscle) => {
  switch (muscle) {
    case "Anterior deltoid":
      return "Shoulders";
    case "Biceps brachii":
      return "Arms";
    case "Biceps femoris":
      return "Legs";
    case "Brachialis":
      return "Chest";
    case "Gastrocnemius":
      return "Legs";
    case "Gluteus maximus":
      return "Legs";
    case "Latissimus dorsi":
      return "Back";
    case "Obliquus externus abdominis":
      return "Core";
    case "Pectoralis major":
      return "Chest";
    case "Quadriceps femoris":
      return "Legs";
    case "Rectus abdominis":
      return "Core";
    case "Serratus anterior":
      return "Back";
    case "Soleus":
      return "Legs";
    case "Trapezius":
      return "Back";
    case "Triceps brachii":
      return "Arms";
    case "Abductors":
      return "Legs";
    case "Adductors":
      return "Legs";
    default:
      return null;
  }
};

export const getMuscleGroupPercentages = (data) => {
  const grupos = ["Core", "Chest", "Back", "Legs", "Arms", "Shoulders"];

  const totalVeces = data.reduce((acc, item) => acc + item.veces, 0); //Calcular el total para luego hacer el porcentaje

  const countpergroup = {};

  grupos.forEach((grupo) => {
    // Inicializo en 0
    countpergroup[grupo] = 0;
  });

  data.forEach(({ musculo, veces }) => {
    // Recorro los musculos, los paso a grupo y sumo el numero de veces
    const grupo = mapMuscleToGroup(musculo);
    if (grupo) {
      countpergroup[grupo] += veces;
    }
  });

  const result = grupos.map((grupo) => ({
    x: grupo,
    y: totalVeces > 0 ? parseFloat(countpergroup[grupo] / totalVeces) : 0,
  }));

  return result;
};
