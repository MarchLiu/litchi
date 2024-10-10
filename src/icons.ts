import { LabIcon } from '@jupyterlab/ui-components';

export const litchiIcon = new LabIcon({
  name: 'litchi-icon',
  svgstr:
    '<svg width="200px" height="200px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n' +
    '  <ellipse cx="100" cy="100" rx="50" ry="40" fill="#FF6347" />\n' +
    '  <path d="M100,60 Q90,20 110,20 Q120,40 100,60" fill="#228B22" />\n' +
    '  <circle cx="70" cy="90" r="5" fill="#FFFFFF" />\n' +
    '  <circle cx="130" cy="90" r="5" fill="#FFFFFF" />\n' +
    '  <circle cx="90" cy="110" r="5" fill="#FFFFFF" />\n' +
    '  <circle cx="110" cy="110" r="5" fill="#FFFFFF" />\n' +
    '  <line x1="100" y1="140" x2="100" y2="160" stroke="#8B4513" stroke-width="2" />\n' +
    '</svg>'
});

export const caIcon = new LabIcon({
  name: 'litchi-ca',
  svgstr:
    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CA</text>\n' +
    '</svg>'
});
export const chIcon = new LabIcon({
  name: 'litchi-ch',
  svgstr:
    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CH</text>\n' +
    '</svg>'
});
export const csIcon = new LabIcon({
  name: 'litchi-cs',
  svgstr:
    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CS</text>\n' +
    '</svg>'
});
export const ctIcon = new LabIcon({
  name: 'litchi-ct',
  svgstr:
    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CT</text>\n' +
    '</svg>'
});

export const ccIcon = new LabIcon({
  name: 'litchi-cc',
  svgstr:
    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">CC</text>\n' +
    '</svg>'
});

export const scIcon = new LabIcon({
  name: 'litchi-sc',
  svgstr:
    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">SC</text>\n' +
    '</svg>'
});

function capitalizeFirstLetter(input: string): string {
  if (input.length === 0) {
    return input;
  }
  if (input.length === 1) {
    return input.charAt(0).toUpperCase();
  }
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

function getLanguageAbbreviation(countryName: string): string {
  const countryAbbreviations: { [key: string]: string } = {
    Chinese: 'Ch',
    English: 'En',
    French: 'Fr',
    German: 'De'
  };

  return (
    countryAbbreviations[countryName] || capitalizeFirstLetter(countryName)
  );
}

export const langIcon = (lang: string) => {
  const name = getLanguageAbbreviation(lang);
  return new LabIcon({
    name: `litchi-${name}`,
    svgstr:
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
      `    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">${name}</text>\n` +
      '</svg>'
  });
};

export const unitTestIcon = new LabIcon({
  name: 'litchi-unit-test',
  svgstr:
    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <text x="0" y="10" font-family="Arial" font-size="10" fill="black">UT</text>\n' +
    '</svg>'
});
