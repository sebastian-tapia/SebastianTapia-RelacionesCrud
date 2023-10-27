const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_products_${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage
})


module.exports = upload


{/* <div class="pagination">
    <% if (paginate.hasPreviousPages || paginate.hasNextPages(pagesCount)) { %>
        <% if (paginate.hasPreviousPages) { %>
            <a href="<%=paginate.href(true).prev%>" class="page-number prev"><i class="fa fa-angle-left"></i></a>
        <% } %>
        <% if (pages) { %>
            <% pages.forEach(page => { %>
                <a href="<%= page.url %>" class="page-number <%= page.number === currentPage && 'current' %> "><%= page.number%></a>
                <% }) %>
        <% } %>
    
        <% if (paginate.hasNextPages(pagesCount)) { %>
            <a href="<%= paginate.href() %>" class="page-number prev"><i class="fa fa-angle-right"></i></a>
        <% } %>
    <% } %>
</div> */}



/* MOVIE LIST */

/* <% if (paginate.hasPreviousPages || paginate.hasNextPages(pagesCount)) { %>
                      <% if (paginate.hasPreviousPages) { %>
                        <li class="page-item">
                          <a class="page-link" href="<%=paginate.href(true).prev%>" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                          </a>
                        </li>
                        <% } %>
                          <% if (pages) { %>
                            <% pages.forEach(page=> { %>
                              <li class="page-number">
                                <a href="<%= page.url %>" class="page-link <%= page.number === currentPage && 'active' %> ">
                                  <%= page.number%>
                                </a>
                  
                              </li>
                              <% }) %>
                                <% } %>
                                <% if (paginate.hasNextPages(pagesCount)) { %>
                                    <li class="page-item">
                                      <a class="page-link" href="<%=paginate.href()%>" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                      </a>
                                    </li>
                                    <% } %>
                  
                                      <% } %>
                  
                  </ul>
                                */