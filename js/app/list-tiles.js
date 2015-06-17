$(function () {

        // Init variables
        var $items = $( '.list-element' ),
            current = -1,
            linksClass;

        //Initialization
        function init() {
            disableLinks();
            $(window).on('resize', disableLinks);

            initEvents( );
        }

        function disableLinks() {
            var windowWidth = $(window).width();
            if ( windowWidth > 1023 ) {
                $('.list-element-title').addClass('link-disabled');
                $('.list-element-title a').click(function() {
                    return false;
                });
                linksClass = '.list-element-link';
            } else {
                $('.list-element-title').removeClass('link-disabled');
                linksClass = '.list-element-title';
            }

        }

        function initEvents(links) {

            $items.on('click', 'span.description-close', function() {
                hideDescription();
                return false;
            }).find(linksClass).on('click', function() {

                var $item = $(this).parent().parent();

                current === $items.index($item) ? hideDescription() : showDescription( $item );

                return false;
            });

        }

        function showDescription($item) {
            var description = $.data( this, 'description' );

            if( typeof description != 'undefined' ) {
                hideDescription();
            }

            description = $.data( this, 'description', new Description( $item ) );

            description.open();

        }

        function hideDescription() {
            current = -1;
            var description = $.data( this, 'description' );
            description.close();
            $.removeData( this, 'description' );
        }

        // Create object
        function Description( $item ) {
            this.$item = $item;
            this.create();
            this.update();
        }

        // 
        Description.prototype = {
            create: function() {
                // Create mark-up
                this.$header = $( '<h3></h3>' );
                this.$bodyText = $( '<p></p>' );
                this.$presenter = $( '<p class="list-element-presenter"></p>' );
                this.$eventLanguage = $( '<p></p>' );
                this.$href = $( '<a href="#">Sign up</a>' );
                this.$content = $( '<div class="list-element-description-content"></div>' ).append( this.$header, this.$bodyText, this.$presenter, this.$eventLanguage, this.$href );
                this.$topBorder = $( '<div class="top-border"></div>' );
                this.$closeDescription = $( '<span class="description-close"></span>' );
                this.$bottomBorder = $( '<div class="bottom-border"></div>' );
                this.$descriptionInner = $( '<div class="list-element-description-inner container-fluid max-site-width center-block">' )
                                            .append( this.$topBorder, this.$closeDescription, this.$content, this.$bottomBorder );
                this.$descriptionEl = $( '<div class="list-element-description"></div>' ).append( this.$descriptionInner );
                this.$item.append( this.$descriptionEl );
            },
            update: function() {
                // console.log( 'index: ', this.$item.index() );
                
                if( current !== -1 ) {
                    var $currentItem = $items.eq( current );
                    $currentItem.removeClass( 'list-element-expanded' );
                    this.$item.addClass( 'list-element-expanded' );
                }

                current = $items.index(this.$item);

                //Get data
                var elData = {
                    header: this.$item.data( 'header' ),
                    bodyText: this.$item.data( 'text' ),
                    presenter: this.$item.data( 'presenter' ),
                    eventLanguage: this.$item.data( 'language' )
                };

                this.$header.html( elData.header );
                this.$bodyText.html( elData.bodyText );
                this.$presenter.html( elData.presenter );
                this.$eventLanguage.html( elData.eventLanguage );

                this.$item.addClass( 'list-element-expanded' );
            },
            open: function() {
                this.setHeight();
                this.$descriptionEl.css('opacity', '1');
            },
            setHeight: function() {
                this.height = this.$descriptionEl.outerHeight() + this.$item.outerHeight();
                this.$item.css( 'height', this.height );
            },
            close: function() {
                var self = this;

                this.$descriptionEl.css('opacity', '0');
                this.$item.css( 'height', 'auto' );

                self.$item.removeClass( 'list-element-expanded' );
                self.$descriptionEl.remove();
            }
        }

       init();

});