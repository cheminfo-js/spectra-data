'use strict';
/**
 * Created by acastillo on 4/26/16.
 */
/**
 * This function performs a circular shift of the input object without realocating memory.
 * Positive values of shifts will shift to the right and negative values will do to the left
 * @example rotate([1,2,3,4],1) -> [4,1,2,3]
 * @example rotate([1,2,3,4],-1) -> [2,3,4,1]
 * @param array
 */
function rotate(array,shift){
    var nbPoints = array.length;
    //Lets calculate the lest amount of points to shift.
    //It decreases the amount of validations in the loop
    shift = shift%nbPoints;

    if(Math.abs(shift)>nbPoints/2){
        shift = shift>0?shift-nbPoints:shift+nbPoints;
    }

    if(shift!=0){
        var currentIndex=0, nextIndex=shift;
        var toMove = nbPoints;
        var current = array[currentIndex], next;
        var lastFirstIndex = shift;
        var direction = shift>0?1:-1;

        while(toMove>0){
            nextIndex = putInRange(nextIndex,nbPoints);
            next = array[nextIndex];
            array[nextIndex] = current;
            nextIndex+=shift;
            current = next;
            toMove--;

            if(nextIndex==lastFirstIndex){
                nextIndex = putInRange(nextIndex+direction,nbPoints);
                lastFirstIndex = nextIndex;
                currentIndex = putInRange(nextIndex-shift,nbPoints);
                current = array[currentIndex];
            }
        }
    }
}

function putInRange(value, nbPoints){
    if(value<0)
        value+=nbPoints;
    if(value>=nbPoints)
        value-=nbPoints;
    return value;
}

module.exports = rotate;


/*var foo = [1,2,3,4,5,6];
rotate(foo,-4);
console.log(foo);*/