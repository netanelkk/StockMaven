export const Sort = {};

let currentdrag = 0;
Sort.indexmap = [];
Sort.stockmap = [];
Sort.reorder = null;

Sort.init = (cells, stockmap, reorder) => {
    for (let i = 0; i < cells; i++) {
        Sort.indexmap.push(i);
    }
    Sort.stockmap = stockmap;
    Sort.reorder = reorder;
}

Sort.dragenter = () => {
    document.getElementById("widget" + currentdrag).classList.add("over");
}
 
Sort.dragover = async (e, i) => {
    e.preventDefault();
    if (i != currentdrag) {
        const boxoffset = document.getElementById("widget" + i).getBoundingClientRect().left;
        const boxwidth = document.getElementById("widget" + i).offsetWidth + 20;

        let from = Sort.indexmap.indexOf(currentdrag) + 1;
        let to = Sort.indexmap.indexOf(i);

        // dragged on right or left side of element
        if (e.pageX - boxoffset < boxwidth / 3) { // left half
            to = Sort.indexmap.indexOf(i) - 1;
        }

        if (from > to) {
            for (let j = Sort.indexmap.indexOf(currentdrag) - 1; j >= to + 1; j--) {
                document.getElementById("dragparent").insertBefore(document.getElementById("drag" + currentdrag), document.getElementById("drag" + Sort.indexmap[j]));

                const temp = Sort.indexmap[j];
                Sort.indexmap[j] = Sort.indexmap[j + 1];
                Sort.indexmap[j + 1] = temp;

                const temp2 = Sort.stockmap[j];
                Sort.stockmap[j] = Sort.stockmap[j + 1];
                Sort.stockmap[j + 1] = temp2;

                await new Promise(resolve => {
                    window.requestAnimationFrame(resolve);
                });
            }
        } else {
            for (let j = Sort.indexmap.indexOf(currentdrag) + 1; j <= to; j++) {
                document.getElementById("dragparent").insertBefore(document.getElementById("drag" + Sort.indexmap[j]), document.getElementById("drag" + currentdrag));

                const temp = Sort.indexmap[j];
                Sort.indexmap[j] = Sort.indexmap[j - 1];
                Sort.indexmap[j - 1] = temp;

                const temp2 = Sort.stockmap[j];
                Sort.stockmap[j] = Sort.stockmap[j - 1];
                Sort.stockmap[j - 1] = temp2;

                await new Promise(resolve => {
                    window.requestAnimationFrame(resolve);
                });
            }
        }



    }
}

Sort.dragend = () => {
    document.getElementById("widget" + currentdrag).classList.remove("over");
    if (Sort.reorder)
        Sort.reorder(Sort.stockmap.join())
}

Sort.dragstart = (i) => {
    currentdrag = i;
    document.getElementById("widget" + currentdrag).classList.add("over");
}

Sort.kill = () => {
    currentdrag = 0;
    Sort.indexmap = [];
    Sort.stockmap = [];
    Sort.reorder = null;
}