const animals = 'rat ox tiger rabbit dragon snake horse goat monkey rooster dog pig'.split(' ');
const englishAnimals = 'Rat Ox Tiger Rabbit Dragon Snake Horse Goat Monkey Rooster Dog Pig'.split(' ');
const traditionalAnimals = '鼠牛虎兔龍蛇馬羊猴雞狗豬';
const simplifiedAnimals = '鼠牛虎兔龙蛇马羊猴鸡狗猪';

function getZodiac(lunar, language) {
  const index = ((lunar.getYear() - 1900) % 12 + 12) % 12;
  const names = { traditional: traditionalAnimals, simplified: simplifiedAnimals, english: englishAnimals };
  return { animalFile: animals[index], animal: names[language][index] };
}

module.exports = { getZodiac };
