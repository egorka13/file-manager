import { homedir, EOL, cpus, userInfo, arch } from 'os';

function getOsInfo(option) {
  switch (option) {
    case '--EOL':
      console.log(JSON.stringify(EOL));
      break;
    case '--cpus':
      const cpuInfo = cpus();
      cpuInfo.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000}GHz`);
      });
      break;
    case '--homedir':
      console.log(homedir());
      break;
    case '--username':
      console.log(userInfo().username);
      break;
    case '--architecture':
      console.log(arch());
      break;
    default:
      console.error('Invalid input');
  }
}

export { getOsInfo };
