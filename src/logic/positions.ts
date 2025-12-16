export function positions() {
  const regions: {
    [regionId: string]: {
      [objectId: string]: boolean
    }
  } = {};

  const objData: {
    [objectId: string]: {
      hitbox: {
        lEdge: number;
        rEdge: number;
        tEdge: number;
        bEdge: number;
      };
      regions: string[];
    };
  } = {};

  let idGen = 0;
  let chunkLength = 100;

  function updateObjectPosition(
    objectId: string | null,
    hitboxData: {
      lEdge: number;
      rEdge: number;
      tEdge: number;
      bEdge: number;
    },
  ) {
    const oid: string = objectId || `obj_${idGen++}`;
    const regs: string[] = objData[oid]?.regions || [];

    for (const region of regs) {
      delete regions[region][oid];
      if (Object.keys(regions[region]).length === 0) {
        delete regions[region];
      }
    }

    const hStart = Math.floor(hitboxData.lEdge / chunkLength);
    const hEnd = Math.floor(hitboxData.rEdge / chunkLength);
    const vStart = Math.floor(hitboxData.tEdge / chunkLength);
    const vEnd = Math.floor(hitboxData.bEdge / chunkLength);

    objData[oid] = {
      hitbox: hitboxData,
      regions: [],
    };

    for (let h = hStart; h <= hEnd; h++) {
      for (let v = vStart; v <= vEnd; v++) {
        const regionId = `reg_${h}_${v}`;
        
        if (!regions[regionId])
          regions[regionId] = {};
        
        regions[regionId][oid] = true;
        objData[oid].regions.push(regionId);
      }
    }

    return oid;
  }

  function collides(idA: string, idB: string) {
    const objA = objData[idA];
    const objB = objData[idB];

    if (objA.hitbox.rEdge < objB.hitbox.lEdge) return false;
    if (objA.hitbox.lEdge > objB.hitbox.rEdge) return false;
    if (objA.hitbox.bEdge < objB.hitbox.tEdge) return false;
    if (objA.hitbox.tEdge > objB.hitbox.bEdge) return false;

    return true;
  }

  function checkCollision(targetObjectId: string) {
    const regs = objData[targetObjectId].regions;
    const checkedObjects: {
      [objectId: string]: boolean
    } = {};

    for (const region of regs) {
      for (const objectId in regions[region]) {
        if (objectId === targetObjectId) continue;
        if (checkedObjects[objectId]) continue;

        const collided = collides(
          targetObjectId,
          objectId,
        );
        
        if (collided) return objectId;
        checkedObjects[objectId] = true;
      }
    }

    return null;
  }

  function removeObject(objectId: string) {
    const regs = objData[objectId]?.regions || [];

    for (const region of regs) {
      delete regions[region][objectId];
      if (Object.keys(regions[region]).length === 0) {
        delete regions[region];
      }
    }

    delete objData[objectId];
  }

  return {
    static: {
      updateObjectPosition,
      checkCollision,
      removeObject,
    },
  };
}

