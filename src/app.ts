export class App {
  ParseWellPDSDesign(wellRawDesign: string[]): any {
    const result = [];
    //тут хранится текущий комментарий, для случая, когда конструкции колонны в разных строках
    let currentComment = '';
    for (const i in wellRawDesign) {
      const wellDesignRecord = { diameter: '', start: '0', end: '', comment: '' };
      //текущая запись о колонне
      let currentWellRawDesign = wellRawDesign[i];
      currentWellRawDesign = currentWellRawDesign.replace(/[хx]/ig, 'x').trim();
      //на случай, когда коммент и конструкция в разных записях, добавляем комментарий из предыдущей записи
      currentWellRawDesign = (currentComment + ' ' + currentWellRawDesign).trim();
      //будем искать все вхождения вида 123(/)(,2)х123(/)(,2)(-123(/)(,2))
      const regex = new RegExp(/([0-9/\\-]+,*[0-9]*)\s*[хx]\s*([0-9/\\-]+,*[0-9]*)(\s*-*\s*([0-9]+,*[0-9]*))*/ig);
      let searchRes;
      if ((searchRes = regex.exec(currentWellRawDesign))) {
        //комментарий - это все что не является описанием колонны
        wellDesignRecord.comment = currentWellRawDesign.replace(searchRes[0], '').trim();
        //находим компоненты колонны диаметр и длинну
        const raw = searchRes[0].replace(/[,]/ig, '.').replace(/[\\]/ig, '/').split('x');
        if (raw.length > 1) {
          wellDesignRecord.diameter = raw[0].trim();
          wellDesignRecord.end = raw[1].trim();
          //если указан диапазон длинны - испуользуем его
          const raw1 = raw[1].replace(/[,]/ig, '.').split('-');
          if (raw1.length > 1) {
            wellDesignRecord.start = raw1[0].trim();
            wellDesignRecord.end = raw1[1].trim();
          }
          //если в описании колонны несколько диаметров - разделяем их
          const splashDiametr = wellDesignRecord.diameter.split('/');
          const splashStart = wellDesignRecord.start.split('/');
          const splashEnd = wellDesignRecord.end.split('/');
          if (splashDiametr.length > 1 && (splashStart.length > 1 || splashEnd.length)) {
            const wellDesignRecord0 = { diameter: '', start: '0', end: '', comment: '' };
            wellDesignRecord0.comment = wellDesignRecord.comment;
            wellDesignRecord0.diameter = splashDiametr[0];
            wellDesignRecord0.start = splashStart[0];
            wellDesignRecord0.end = splashEnd[0];
            result.push(wellDesignRecord0);
            wellDesignRecord.diameter = splashDiametr[1];
            if (splashEnd.length > 1) {
              wellDesignRecord.start = splashEnd[0];
              wellDesignRecord.end = splashEnd[1];
            }
          }
        }
        result.push(wellDesignRecord);
        currentComment = '';
      } else {
        //в строке нет конструкции колонны - сохраняем как комментарий к последующей
        currentComment = currentWellRawDesign;
      }
    }
    return result;
  }
}
